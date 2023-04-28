const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema({
  name: String,
  teachers: [mongoose.Schema.Types.ObjectId],
  students: [mongoose.Schema.Types.ObjectId],
});

const Classroom = mongoose.model("Classroom", classroomSchema);
module.exports = Classroom;
