const spacesUrl =
  "https://crryyv9u6a.execute-api.eu-west-1.amazonaws.com/prod/";

export const config = {
  REGION: "eu-west-1",
  USER_POOL_ID: "eu-west-xxx",
  APP_CLIENT_ID: "xxx",
  IDENTITY_POOL_ID: "eu-west-1:xxx",
  SPACES_PHOTOS_BUCKET_NAME: "spaces-photos-xxx",
  api: {
    baseUrl: spacesUrl,
    spacesUrl: spacesUrl + "spaces",
  },
};
