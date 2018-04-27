export class index {
  info;
  due;
  tag;

  constructor() 
  {
    let date = new Date(2018,5,2);
    this.info = 'CSC435/635';
    this.due = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
  }
}
