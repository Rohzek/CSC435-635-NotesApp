export class footer {
  tag;

  constructor() 
  {
    let date = new Date();
    this.tag = 'Created ' + date.getFullYear();
  }
}
