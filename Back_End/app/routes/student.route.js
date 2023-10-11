const express = require("express");
const router = express.Router();
const StudentController = require("../controllers/student.controller");

router.route("/")
    .get(StudentController.getAll)
    .post(StudentController.create)

router.route("/:studentId")
    .put(StudentController.update)
    .delete(StudentController.delete)

module.exports = router;
