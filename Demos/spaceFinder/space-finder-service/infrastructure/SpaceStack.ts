import { Stack, StackProps } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import {
  AuthorizationType,
  LambdaIntegration,
  MethodOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { join } from "path";
import { GenericTable } from "./GenericTable";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { AuthorizerWrapper } from "./auth/AuthorizerWrapper";

export class SpaceStack extends Stack {
  private api = new RestApi(this, "SpaceApi");
  private authorizer: AuthorizerWrapper;
  private spacesTable = new GenericTable(this, {
    tableName: "SpacesTable",
    primaryKey: "spaceId",
    createLambdaPath: "Create",
    readLambdaPath: "Read",
    updateLambdaPath: "Update",
    deleteLambdaPath: "Delete",
    secondaryIndexes: ["location"],
  });

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.authorizer = new AuthorizerWrapper(this, this.api);

    const helloWorldLambdaNodeJs = new NodejsFunction(
      this,
      "helloWorldLambdaNodeJs",
      {
        entry: join(
          __dirname,
          "..",
          "services",
          "node-lambda",
          "helloWorld.ts"
        ),
        handler: "handler",
      }
    );

    // add permissions
    const s3ListPolicy = new PolicyStatement();
    s3ListPolicy.addActions("s3:ListAllMyBuckets");
    s3ListPolicy.addResources("*");

    helloWorldLambdaNodeJs.addToRolePolicy(s3ListPolicy);

    const optionsWithAuthorizer: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: { authorizerId: this.authorizer.authorizer.authorizerId },
    };

    // Hello World Api Lambda integration
    const helloWorldLambdaIntegration = new LambdaIntegration(
      helloWorldLambdaNodeJs
    );
    const helloWorldLambdaResource = this.api.root.addResource("hello");
    helloWorldLambdaResource.addMethod(
      "GET",
      helloWorldLambdaIntegration,
      optionsWithAuthorizer
    );

    // Spaces Api Lambda integration
    const spaceResource = this.api.root.addResource("spaces");
    spaceResource.addMethod("POST", this.spacesTable.createLambdaIntegration);
    spaceResource.addMethod("GET", this.spacesTable.readLambdaIntegration);
    spaceResource.addMethod("PUT", this.spacesTable.updateLambdaIntegration);
    spaceResource.addMethod("DELETE", this.spacesTable.deleteLambdaIntegration);
  }
}