const PostgreSQLDatabase = require("../pgsql.utils");
const ApiError = require('../../api-error');
const db = new PostgreSQLDatabase();


class StudentController {
  async getAll(req, res, next) {
    let {search} = req.query || null;
    try {
      if(search){
        const statement = `SELECT * FROM STUDENT
                           WHERE student_id LIKE $1 OR full_name LIKE $1`
        const students = await db.query(statement, ['%'+search+'%']);
        return res.status(200).json(students);
      }
      const statement = `SELECT * FROM STUDENT`;
      const students = await db.query(statement);
      return res.status(200).json(students);
    } catch (error) {
      next(error);
    }
  }


  async create(req, res, next) {
    try {
      const data = req.body;
      for (let field in data) {
        data[field] = data[field].trim();
      }
      const statement = `INSERT INTO STUDENT (student_id, full_name, class_id, email) 
                         VALUES ($1, $2, $3, $4) 
                         RETURNING student_id, full_name, class_id, email`;
      const result = await db.query(statement, [
        data.studentId,
        data.fullName,
        data.classId,
        data.email,
      ]);

      return res.status(201).json({ message: "Đã thêm sinh viên thành công", student: result[0]});
    } catch (error) {
      console.log(error);
      if(error.constraint){
        next(new ApiError(400, null , error.constraint));
      }
      next(error);
    }
  }

  async update(req, res, next){
    const {studentId} = req.params;
    const data = req.body;
    for (let field in data) {
      data[field] = data[field].trim();
    }
    console.log(studentId)
    console.log(data);
    const statement = `UPDATE STUDENT
                       SET 
                       student_id = $1,
                       full_name = $2,
                       email = $3,
                       class_id = $4
                       WHERE student_id = $5`

    try {
      await db.query(statement, [data.studentId, data.fullName, data.email, data.classId, studentId]);
      return res.status(200).json({message: "Thông tin đã được cập nhật"});
    } catch (error) {
      if(error.constraint){
        next(new ApiError(400, null , error.constraint));
      }
      next(error);
    }
      
  }

  async delete(req, res, next) {
    const { studentId } = req.params;
    const statement = `DELETE FROM STUDENT WHERE student_id = $1`;

    try {
      await db.query(statement, [studentId]);
      return res.status(200).json({ message: "Xóa thành công" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Lỗi phía server" });
    }
  }
}

module.exports = new StudentController();
