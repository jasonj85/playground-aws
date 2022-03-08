import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";

export default (handler) =>
  middy(handler).use([
    httpJsonBodyParser(), // parse stringify body
    httpEventNormalizer(), // can help errors with empty objects or non existing parameters
    httpErrorHandler(), // make error handling cleaner
  ]);
