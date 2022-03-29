import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;
const dbClient = new DynamoDB.DocumentClient();

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify("Hello from DynamoDB!"),
  };

  try {
    if (event.queryStringParameters) {
      // Query with primary partition key
      if (PRIMARY_KEY in event.queryStringParameters) {
        result.body = await queryWithPrimaryPartition(
          event.queryStringParameters
        );
      } else {
        // Query with secondary partition key
        result.body = await queryWithSecondaryPartition(
          event.queryStringParameters
        );
      }
    } else {
      // Scan all items
      result.body = await scanTable();
    }
  } catch (error) {
    result.statusCode = 500;
    result.body = JSON.stringify(error);
  }

  return result;
}

async function scanTable() {
  const response = await dbClient.scan({ TableName: TABLE_NAME! }).promise();
  return JSON.stringify(response.Items);
}

async function queryWithPrimaryPartition(
  queryParams: APIGatewayProxyEventQueryStringParameters
) {
  const keyValue = queryParams[PRIMARY_KEY!];

  const response = await dbClient
    .query({
      TableName: TABLE_NAME,
      KeyConditionExpression: "#xx = :xxxx",
      ExpressionAttributeNames: {
        "#xx": PRIMARY_KEY,
      },
      ExpressionAttributeValues: {
        ":xxxx": keyValue,
      },
    })
    .promise();
  return JSON.stringify(response.Items);
}

async function queryWithSecondaryPartition(
  queryParams: APIGatewayProxyEventQueryStringParameters
) {
  const queryKey = Object.keys(queryParams)[0];
  const queryValue = queryParams[queryKey];
  const response = await dbClient
    .query({
      TableName: TABLE_NAME,
      IndexName: queryKey,
      KeyConditionExpression: "#xx = :xxxx",
      ExpressionAttributeNames: {
        "#xx": queryKey!,
      },
      ExpressionAttributeValues: {
        ":xxxx": queryValue,
      },
    })
    .promise();
  return JSON.stringify(response.Items);
}

export { handler };
