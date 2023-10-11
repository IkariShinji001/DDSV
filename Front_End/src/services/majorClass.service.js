import createApiClient from "./config"

export default class MajorClassService{
  constructor(endpoint = '/classes'){
    this.api = createApiClient(endpoint);
  }

  async getClasses(search = null){
    const classes = await this.api.get("/", {params: {search}});
    return classes.data;
  }

  async getStudentsByClassId(classId, search=null){
    const students = await this.api.get(`/${classId}/students`, {params: {search}});
    return students.data;
  }

  async create(newClass){
    console.log(newClass);
    const result = await this.api.post("/", {classId: newClass.classId, className: newClass.className});
    return result.data;
  }

  async getClassById(classId){
    const mclass = await this.api.get(`/${classId}`);
    return mclass.data;
  }
  
  async deleteClassById(classId){
    const result = await this.api.delete(`/${classId}`);
  }
}
