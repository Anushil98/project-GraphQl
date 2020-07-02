const mongoose = require("mongoose");
const schema = mongoose.Schema;

const AuthorSchema = schema({
  name: { type: String },
  age: { type: String },
});

module.exports = mongoose.model("Author", AuthorSchema);
