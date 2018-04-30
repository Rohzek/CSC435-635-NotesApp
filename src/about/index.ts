export class index {
  due;
  info;
  tag;

  constructor() 
  {
    let date = new Date(2018,5,2);
    this.due = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
    this.info = 'CSC 435/635 final project';
  }
}
