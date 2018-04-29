import { autoinject, Aurelia } from 'aurelia-framework';
import {HttpClient, json, HttpClientConfiguration} from 'aurelia-fetch-client';
import {Note} from './../json/note';
import {User} from './../json/user';
import {Category} from './../json/category';

@autoinject
export class index {
  httpClient: HttpClient;

  notes = new Set<Note>();
  cats = new Array<Category>();
  users = new Array<User>();
  index = 1;

  selectedId : number = null;
  selectedTitle : string = null;
  selectedNote : string = null;
  selectedCat: number = null;
  selectedUsr: number = null;

  now = new Date();
  newNote = new Note("", "", "", "", "", "", "", new Category("", ""), new User("", "", "", this.now));

  constructor(httpClient: HttpClient) {
    httpClient.configure(config => {
      config
        .withBaseUrl('https://notesapiassignment7.azurewebsites.net/api/')
        .withDefaults({
          headers: {
            'Content-Type': 'application/json'
          }});
    });
    this.httpClient = httpClient;

    this.getData();
    this.updates();
  }

  updates() {
    this.updateCats();
    this.updateUsers();
  }

  updateCats() {
    this.notes.clear();
    this.httpClient.fetch('categories', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        for(let entry of data) {
          var cat = new Category(entry.id, entry.name);
          var present = false;

          for(var ct of this.cats) {
            if(ct.id == cat.id) {
              present = false;
            }
          }

          if(present == false) {
            this.cats.push(cat);
          }}});
  }

  updateUsers() {
    this.notes.clear();
    this.httpClient.fetch('users', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        for(let entry of data) {
          var user = new User(entry.id, entry.email, entry.name, entry.createdOn);
          var present = false;

          for(var usr of this.users) {
            if(usr.id == user.id) {
              present = false;
            }
          }

          if(present == false) {
            this.users.push(user);
          }}});
  }

  // Get note
  async getData() {
    console.log("GET called");
    this.notes.clear();
    this.httpClient.fetch('notes', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        for(let entry of data) {
          var cat = new Category(entry.category.id, entry.category.name);
          var user = new User(entry.user.id, entry.user.email, entry.user.name, entry.user.createdOn);
          var note = new Note(entry.id, entry.title, entry.note, entry.createdOn, entry.categoryid, entry.isDeleted, entry.userid, cat, user);
          this.notes.add(note);
          this.index = note.id + 1;
        }
      })
  }

  // Add note
  putData() {
    console.log("POST called");
    if(this.newNote.id == null || this.newNote.title == null || this.newNote.note == null || this.selectedCat == null || this.selectedUsr == null) {
      alert("Error!: Failed to make a new note, or edit a previous one. Please check all fields, and try again.");
    }
    else {
      this.newNote.category = this.cats[this.selectedCat - 1];
      this.newNote.user = this.users[this.selectedUsr - 1];
      this.newNote.createdOn = this.now;
      this.newNote.categoryid = this.newNote.category.id;
      this.newNote.isDeleted = false;
      this.newNote.userid = this.newNote.user.id;

      // If can be POST'ed
      if(true)
      {
        this.httpClient.fetch('notes', {
          method: 'POST',
          body: JSON.stringify(this.newNote),
        })
        .then(data => {
          console.log(data);
       });
      }
      else {}
      
    }
  }

  // Delete note
  deleteData(num) {
    console.log("DELETE called on Note: " + num);
    console.log(this.httpClient.baseUrl + 'notes/' + num);
    this.httpClient.fetch('notes/' + num, {
      method: 'DELETE'
    })
    .then(data => {
      console.log(data);
    });
  }

  refreshPage() {
    window.location.reload();
  }
}
