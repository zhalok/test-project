const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: String,
  age: Number,
  subject: String,
});

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;
