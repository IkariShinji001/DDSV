const express = require("express");
const cors = require("cors");
const app = express();

const studentRoute = require("./app/routes/student.route")
const majorClassRoute = require("./app/routes/majorClass.route")

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/students", studentRoute);
app.use("/api/v1/classes", majorClassRoute)

app.use((error, req, res, next) => {
  if(error.constraint === "student_pkey"){
    error.message = "Trùng mã số sinh viên!";
  }
  if (error.constraint === "student_class_id_fkey") {
    error.message = "Không tồn tại mã lớp!";
  }

  if (error.constraint === "major_class_pkey") {
    error.message = "Đã tồn tại mã lớp!";
  }
  return res.status(error.statusCode || 500).json({message: error.message || "Lỗi xảy ra ở phía server"})
})

module.exports = app;