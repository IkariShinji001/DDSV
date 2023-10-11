const express = require("express");
const router = express.Router();
const MajorClassController = require("../controllers/majorClass.controller");

router.route("/")
    .get(MajorClassController.getAll)
    .post(MajorClassController.create)

router.route("/:classId")
    .get(MajorClassController.getClassById)
    .delete(MajorClassController.delete)
    .put(MajorClassController.update)

router.route("/:classId/students")
    .get(MajorClassController.getStudentByClassId)

module.exports = router;
