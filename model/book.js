const mongoose = require("mongoose");
const schema = mongoose.Schema;

const bookSchema = schema({
  name: { type: String },
  genre: { type: String },
  authorId: { type: mongoose.Schema.Types.ObjectId },
});

module.exports = mongoose.model("Book", bookSchema);
