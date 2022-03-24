exports.main = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.parse({ message: "Hello World!" }),
  };
};
