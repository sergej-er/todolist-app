const mongoose = require("mongoose");
const { Schema } = mongoose;

const todoSchema = new Schema({
  name: String,
});

mongoose.model("todos", todoSchema);

module.exports = todoSchema;
