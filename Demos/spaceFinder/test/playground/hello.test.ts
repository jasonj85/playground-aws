import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../services/SpacesTable/Create";

const event: APIGatewayProxyEvent = {
  // queryStringParameters: {
  //   spaceId: "dd3aaf85-6192-4f79-adae-136ffe4c4fe8",
  // },
  body: {
    location: "update location",
  },
} as any;

handler(event, {} as any);
