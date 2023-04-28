const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/student");
const Teacher = require("./models/teacher");
const Classroom = require("./models/classroom");

const app = express();
const port = 5000;

mongoose
  .connect("mongodb://127.0.0.1:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// lets create 1000 classrooms with 1000 teachers and students each

app.post("/students", (req, res) => {
  const students = [];
  for (let i = 0; i < 1000; i++) {
    const student = new Student({
      name: `Student ${i}`,
    });
    students.push(student);
  }
  Student.insertMany(students).then((result) => {
    res.json(result);
  });
});

app.post("/teachers", (req, res) => {
  const teachers = [];
  for (let i = 0; i < 1000; i++) {
    const teacher = new Teacher({
      name: `Teacher ${i}`,
    });
    teachers.push(teacher);
  }
  Teacher.insertMany(teachers).then((result) => {
    res.json(result);
  });
});

app.post("/classrooms", async (req, res) => {
  const classrooms = [];
  const teachers = await Teacher.find({}, null, { limit: 4 });
  const students = await Student.find({}, null, { limit: 4 });

  for (let i = 0; i < 100; i++) {
    const classroom = {
      name: `Classroom ${i}`,
      teachers: teachers.map((teacher) => teacher._id),
      students: students.map((student) => student._id),
    };
    classrooms.push(classroom);
  }
  Classroom.insertMany(classrooms).then((result) => {
    res.json(result);
  });
});

app.get("/classrooms/unoptimized", async (req, res) => {
  const classrooms = await Classroom.find({});
  const teachers = await Teacher.find({});
  const students = await Student.find({});

  const newClassrooms = classrooms.map((classroom) => {
    const newClassroom = classroom.toObject();
    newClassroom.teachers = teachers.filter((teacher) =>
      classroom.teachers.includes(teacher._id)
    );
    newClassroom.students = students.filter((student) =>
      classroom.students.includes(student._id)
    );
    return newClassroom;
  });

  res.json(newClassrooms);
});

app.get("/classrooms/optimized", async (req, res) => {
  const classrooms = await Classroom.aggregate([
    {
      $lookup: {
        from: "teachers",
        localField: "teachers",
        foreignField: "_id",
        as: "teachers",
      },
    },
    {
      $lookup: {
        from: "students",
        localField: "students",
        foreignField: "_id",
        as: "students",
      },
    },
  ]);

  res.json(classrooms);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
