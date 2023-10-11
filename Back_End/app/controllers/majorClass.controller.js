const ApiError = require("../../api-error");
const PostgreSQLDatabase = require("../pgsql.utils");

const db = new PostgreSQLDatabase();

class MajorClassController {
  async getAll(req, res, next) {
    const { search } = req.query;
    try {
      if (search) {
        const statement = `SELECT * FROM MAJOR_CLASS
                           WHERE class_name LIKE $1 OR class_id LIKE $1`;
        const classes = await db.query(statement, ["%" + search + "%"]);
        return res.status(200).json(classes);
      }
      const statement = `SELECT * FROM MAJOR_CLASS`;
      const classes = await db.query(statement);
      return res.status(200).json(classes);
    } catch (error) {
      next(error);
    }
  }

  async getClassById(req, res, next) {
    const { classId } = req.params;
    try {
      const statement = `SELECT class_name FROM MAJOR_CLASS
                         WHERE class_id = $1`;
      const mclass = await db.query(statement, [classId]);

      return res.status(200).json(mclass);
    } catch (error) {
      next(error);
    }
  }

  async getStudentByClassId(req, res, next) {
    const { classId } = req.params;
    const {search} = req.query;
    try {
      if(search){
        const statement = `SELECT mc.class_name, s.student_id, s.full_name, s.email  FROM MAJOR_CLASS mc
                         JOIN STUDENT s ON mc.class_id = s.class_id
                         WHERE mc.class_id = $1 AND (s.student_id LIKE $2 OR s.full_name LIKE $2)`;

      const students = await db.query(statement, [classId, '%'+search+'%']);
      return res.status(200).json(students);
      }
      const statement = `SELECT mc.class_name, s.student_id, s.full_name, s.email  FROM MAJOR_CLASS mc
                         JOIN STUDENT s ON mc.class_id = s.class_id
                         WHERE mc.class_id = $1`;
      const students = await db.query(statement, [classId]);

      return res.status(200).json(students);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    const { classId, className } = req.body;
    try {
      const statement = `INSERT INTO MAJOR_CLASS (class_id, class_name)
                         VALUES($1, $2) RETURNING class_id, class_name`;

      const newClass = await db.query(statement, [classId, className]);

      return res.status(201).json(newClass);
    } catch (error) {
      if (error.constraint) {
        next(new ApiError(400, null, error.constraint));
      }
      next(error);
    }
  }

  async update(req, res, next) {
    const { classId } = req.params;
    const data = req.body;
    for (let field in data) {
      data[field] = data[field].trim();
    }
    const statement = `UPDATE MAJOR_CLASS
                       SET 
                       class_id = $1,
                       class_name = $2
                       WHERE class_id = $3
                       `;
    try {
      await db.query(statement, [
        data.classId,
        data.className,
        classId,
      ]);

      return res.status(200).json({ message: "Cập nhật thành công" });
    } catch (error) {
      if (error.constraint) {
        next(new ApiError(400, null, error.constraint));
      }
      next(error);
    }
  }

  async delete(req, res, next) {
    const { classId } = req.params;
    try {
      const statement = `DELETE FROM MAJOR_CLASS 
                         WHERE class_id = $1`;

      await db.query(statement, [classId]);

      return res.status(200).json({ message: "Xóa thành công" });
    } catch (error) {
      if (error.constraint) {
        next(new ApiError(400, null, error.constraint));
      }
      next(error);
    }
  }
}

module.exports = new MajorClassController();
