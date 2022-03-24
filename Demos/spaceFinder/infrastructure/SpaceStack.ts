import { Stack, StackProps, aws_lambda } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { join } from "path";
import { GenericTable } from "./GenericTable";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export class SpaceStack extends Stack {
  private api = new RestApi(this, "SpaceApi");
  private spacesTable = new GenericTable("SpacesTable", "spaceId", this);

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

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

    // Hello World Api Lambda integration
    const helloWorldLambdaIntegration = new LambdaIntegration(
      helloWorldLambdaNodeJs
    );
    const helloWorldLambdaResource = this.api.root.addResource("hello");
    helloWorldLambdaResource.addMethod("GET", helloWorldLambdaIntegration);
  }
}
