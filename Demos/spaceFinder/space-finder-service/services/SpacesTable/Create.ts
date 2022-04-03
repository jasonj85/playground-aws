import { DynamoDB } from "aws-sdk";
import { MissingFieldError, validateAsSpace } from "../Shared/InputValidator";
import {
  generateRandomId,
  getEventBody,
  getDefaultResult,
} from "../Shared/Utils";
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
  const result = getDefaultResult();

  try {
    const item = getEventBody(event);
    item.spaceId = generateRandomId();

    validateAsSpace(item);

    await dbClient
      .put({
        TableName: TABLE_NAME!,
        Item: item,
      })
      .promise();
    result.body = JSON.stringify(item);
  } catch (error: any) {
    if (error instanceof MissingFieldError) {
      result.statusCode = 400;
    } else {
      result.statusCode = 500;
    }
    result.body = JSON.stringify(error.message);
  }

  return result;
}

export { handler };
