import removeDiacritics from "../helpers/removeDiacritics";


export default class Student{
  constructor(studentId, fullName, classId){
    this.studentId = studentId.toUpperCase();
    this.fullName = fullName;
    this.email = null;
    this.classId = classId.toUpperCase();
  }

  generateEmail = () =>{
      this.fullName = this.fullName.trim();
      let firstName =  this.fullName.substring(this.fullName.lastIndexOf(" ") + 1, this.fullName.length)
      firstName = removeDiacritics(firstName);
      const email = `${firstName}${this.studentId}@student.ctu.edu.vn`.toLowerCase();
      this.email = email;
  }

  trim(){
    this.studentId.trim()
    this.fullName.trim()
    this.email.trim();
    this.classId.trim();
  }

  
}