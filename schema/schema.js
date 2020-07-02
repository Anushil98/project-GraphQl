const gql = require("graphql");
const ld = require("lodash");
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID } = gql;

//dummy data
var books = [
  { name: "Alibaba Aur chalees chor", genre: "Fantasy", id: "1" },
  { name: "1984", genre: "political satire", id: "2" },
  { name: "The Long Earth", genre: "Sci-Fi", id: "3" },
];

var Authors = [
  { name: "Anushil", age: 150, id: "1" },
  { name: "Agashi", age: 94, id: "2" },
  { name: "Anurima", age: 66, id: "3" },
];

const Booktype = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
  }), //this is an function because it solves references problems whe their are multiple types
  //later on.
});

const Authortype = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: gql.GraphQLInt },
  }), //this is an function because it solves references problems whe their are multiple types
  //later on.
});

//how we initially jump into the graph
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: Booktype,
      args: { id: { type: GraphQLID } },
      //when someone queries book then the argument id should be passed
      resolve(parent, args) {
        //   args.id contains the id from argument
        //code to get data from db/other source
        return ld.find(books, { id: args.id }); //look for a book with args.id
      },
    },
    author: {
      type: Authortype,
      args: { id: { type: gql.GraphQLID } },
      resolve(parent, args) {
        return ld.find(Authors, { id: args.id });
      },
    },
  }, // no need to warp this around a function as we do not need to worry about the sequence
});

// the query looks something like this
// book(id:"123"){
//     name
//     genre
// }

module.exports = new GraphQLSchema({
  query: RootQuery,
});
