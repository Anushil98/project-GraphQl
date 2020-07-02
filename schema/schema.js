const gql = require("graphql");
const ld = require("lodash");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLNonNull,
} = gql;
const mongoose = require("mongoose");

const Book = require("../model/book");
const Author = require("../model/author");
const book = require("../model/book");
// //dummy data
// var books = [
//   {
//     name: "Alibaba Aur chalees chor",
//     genre: "Fantasy",
//     id: "1",
//     authorId: "2",
//   },
//   { name: "1984", genre: "political satire", id: "2", authorId: "2" },
//   { name: "The Long Earth", genre: "Sci-Fi", id: "3", authorId: "1" },
// ];

// var Authors = [
//   { name: "Anushil", age: 150, id: "1" },
//   { name: "Agashi", age: 94, id: "2" },
//   { name: "Anurima", age: 66, id: "3" },
// ];

const Booktype = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: Authortype,
      async resolve(parent, args) {
        // return ld.find(Authors, { id: parent.authorId }); //relations
        return await Author.findById(parent.id);
      },
    },
  }), //this is an function because it solves references problems whe their are multiple types
  //later on.
});

const Authortype = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: gql.GraphQLInt },
    books: {
      type: gql.GraphQLList(Booktype),
      async resolve(parent, args) {
        // return ld.filter(books, { authorId: parent.id });
        return await Book.find({ authorId: parent._id });
      },
    },
  }), //this is an function because it solves references problems whe their are multiple types
  //the Book type is not accessible here but wraping it in a function makes it available
  // globally when we run this later
});

//how we initially jump into the graph
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: Booktype,
      args: { id: { type: GraphQLID } },
      //when someone queries book then the argument id should be passed
      async resolve(parent, args) {
        //   args.id contains the id from argument
        //code to get data from db/other source
        // return ld.find(books, { id: args.id }); //look for a book with args.id
        return await Book.findById(args.id);
      },
    },
    author: {
      type: Authortype,
      args: { id: { type: gql.GraphQLID } },
      async resolve(parent, args) {
        // return ld.find(Authors, { id: args.id });
        return await Author.findById(args.id);
      },
    },
    books: {
      type: new gql.GraphQLList(Booktype),
      async resolve(parents, args) {
        // return books;
        return await Book.find();
      },
    },
    authors: {
      type: new gql.GraphQLList(Authortype),
      async resolve(parents, args) {
        return await Author.find();
      },
    },
  }, // no need to warp this around a function as we do not need to worry about the sequence
});

// the query looks something like this
// book(id:"123"){
//     name
//     genre
// }

const mutations = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: Authortype,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(gql.GraphQLInt) },//prevents data from being null
      },
      async resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age,
        });
        auth = await author.save();
        console.log(auth);
        return auth;
      },
    },
    addBook: {
      type: Booktype,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(gql.GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });
        return await book.save();
      },
    },
  },
});
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutations, //for mutation in data
});
