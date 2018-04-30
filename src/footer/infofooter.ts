export class infofooter {
  creator;
  symbol;
  year;
  
  constructor() {
    let date = new Date();
    this.creator = "Tony Rocha";
    this.symbol = "©";
    this.year = date.getFullYear();
  }
}
