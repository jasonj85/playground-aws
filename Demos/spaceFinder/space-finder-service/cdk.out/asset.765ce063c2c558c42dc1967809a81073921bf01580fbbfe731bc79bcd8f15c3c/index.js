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

// services/SpacesTable/Read.ts
var Read_exports = {};
__export(Read_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(Read_exports);
var import_aws_sdk = require("aws-sdk");

// services/Shared/Utils.ts
function getDefaultResult() {
  const result = {
    statusCode: 200,
    body: JSON.stringify("Hello from DynamoDB!"),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*"
    }
  };
  return result;
}

// services/SpacesTable/Read.ts
var TABLE_NAME = process.env.TABLE_NAME;
var PRIMARY_KEY = process.env.PRIMARY_KEY;
var dbClient = new import_aws_sdk.DynamoDB.DocumentClient();
async function handler(event, context) {
  const result = getDefaultResult();
  try {
    if (event.queryStringParameters) {
      if (PRIMARY_KEY in event.queryStringParameters) {
        result.body = await queryWithPrimaryPartition(event.queryStringParameters);
      } else {
        result.body = await queryWithSecondaryPartition(event.queryStringParameters);
      }
    } else {
      result.body = await scanTable();
    }
  } catch (error) {
    result.statusCode = 500;
    result.body = JSON.stringify(error);
  }
  return result;
}
async function scanTable() {
  const response = await dbClient.scan({ TableName: TABLE_NAME }).promise();
  return JSON.stringify(response.Items);
}
async function queryWithPrimaryPartition(queryParams) {
  const keyValue = queryParams[PRIMARY_KEY];
  const response = await dbClient.query({
    TableName: TABLE_NAME,
    KeyConditionExpression: "#xx = :xxxx",
    ExpressionAttributeNames: {
      "#xx": PRIMARY_KEY
    },
    ExpressionAttributeValues: {
      ":xxxx": keyValue
    }
  }).promise();
  return JSON.stringify(response.Items);
}
async function queryWithSecondaryPartition(queryParams) {
  const queryKey = Object.keys(queryParams)[0];
  const queryValue = queryParams[queryKey];
  const response = await dbClient.query({
    TableName: TABLE_NAME,
    IndexName: queryKey,
    KeyConditionExpression: "#xx = :xxxx",
    ExpressionAttributeNames: {
      "#xx": queryKey
    },
    ExpressionAttributeValues: {
      ":xxxx": queryValue
    }
  }).promise();
  return JSON.stringify(response.Items);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
