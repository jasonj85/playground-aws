var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// services/node-lambda/helloWorld.ts
var helloWorld_exports = {};
__export(helloWorld_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(helloWorld_exports);
var import_aws_sdk = require("aws-sdk");
var s3Client = new import_aws_sdk.S3();
async function handler(event, context) {
  const buckets = await s3Client.listBuckets().promise();
  if (isAuthorized(event)) {
    return {
      statusCode: 200,
      body: JSON.stringify("You are authorized")
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify("You are NOT authorized")
    };
  }
}
function isAuthorized(event) {
  var _a;
  const groups = (_a = event.requestContext.authorizer) == null ? void 0 : _a.claims["cognito:groups"];
  if (groups) {
    return groups.includes("admins");
  } else
    return false;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});