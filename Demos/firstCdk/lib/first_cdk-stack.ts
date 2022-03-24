import {
  CfnOutput,
  Duration,
  Stack,
  StackProps,
  CfnParameter,
} from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Bucket } from "aws-cdk-lib/aws-s3";

export class FirstCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const duration = new CfnParameter(this, "duration", {
      type: "Number",
      default: 6,
      minValue: 1,
      maxValue: 10,
    });

    const myBucket = new Bucket(this, "myBucket", {
      lifecycleRules: [
        {
          expiration: Duration.days(duration.valueAsNumber),
        },
      ],
    });

    new CfnOutput(this, "mybucket", {
      value: myBucket.bucketName,
    });
  }
}
