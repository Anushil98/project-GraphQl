const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema, //use es6 for schema only as name of key and value is same
    graphiql: true
  })
);

app.listen(4000, () => {
  console.log("Listening to port 4000");
});
