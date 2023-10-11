export default class MajorClass{
  constructor(classId, className){
    this.classId = classId.toUpperCase();
    this.className = className;
  }

  trim(){
    this.classId = this.classId.trim();
    this.className = this.className.trim();  
  }

}
