const mongoose = require("mongoose");
const { Schema } = mongoose;
const todoSchema = require("./Todo");

const listSchema = new Schema({
  name: String,
  todos: [todoSchema],
  _user: { type: Schema.Types.ObjectId, ref: "User" },
});

mongoose.model("lists", listSchema);
