import createApiClient from "./config"

export default class StudentService{
  constructor(endpoint = '/students'){
    this.api = createApiClient(endpoint);
  }

  async getStudents(search = null){
    console.log(search);
    const students = await this.api.get("/", {params: {search}});
    return students.data;
  }


  async create(student){
    const newStudent = await this.api.post("/", 
    {studentId: student.studentId, fullName: student.fullName, email: student.email, classId: student.classId}
    );
    return newStudent.data;
  }

  async update(studentId, data){
    const result = await this.api.put(`/${studentId}`, {studentId: data.studentId, fullName: data.fullName, email: data.email, classId: data.classId})
  }

  async delete(studentId){
    await this.api.delete(`/${studentId}`);
  }



}
