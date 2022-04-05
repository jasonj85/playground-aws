import { Stack, CfnOutput } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { join } from "path";

export class WebAppDeployment {
  private stack: Stack;
  private bucketSuffix: string;
  private deploymentBucket: Bucket;

  constructor(stack: Stack, bucketSuffix: string) {
    this.stack = stack;
    this.bucketSuffix = bucketSuffix;

    this.initialize();
  }

  private initialize() {
    const bucketName = `space-app-web-${this.bucketSuffix}`;
    this.deploymentBucket = new Bucket(this.stack, "space-app-web-id", {
      bucketName: bucketName,
      publicReadAccess: true,
      websiteIndexDocument: "index.html",
    });

    new BucketDeployment(this.stack, "space-app-web-deployment", {
      destinationBucket: this.deploymentBucket,
      sources: [
        Source.asset(join(__dirname, "..", "..", "client-app", "build")),
      ],
    });

    new CfnOutput(this.stack, "space-app-web-url", {
      value: this.deploymentBucket.bucketWebsiteUrl,
      exportName: "space-app-web-url",
    });
  }
}
