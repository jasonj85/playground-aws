import { DynamoDB } from "aws-sdk";
import { v4 as uuid } from "uuid";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

const TABLE_NAME = process.env.TABLE_NAME;
const dbClient = new DynamoDB.DocumentClient();

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify("Hello from DynamoDB!"),
  };

  const item =
    typeof event.body === "object" ? event.body : JSON.parse(event.body);
  item.spaceId = uuid();

  try {
    await dbClient
      .put({
        TableName: TABLE_NAME!,
        Item: item,
      })
      .promise();
  } catch (error) {
    result.statusCode = 500;
    result.body = JSON.stringify(error);
  }

  result.body = JSON.stringify(item);
  return result;
}

export { handler };
