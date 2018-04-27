export class Note {
  id: number;
  title: string;
  note: string;
  createdOn: Date;
  categoryid: number;
  isDeleted: boolean;
  userid: number;
  category?: any;
  user?: any;

  constructor(id, title, note, createdOn) {
    this.id = id;
    this.title = title;
    this.note = note;
    this.createdOn = createdOn;
  }
}
