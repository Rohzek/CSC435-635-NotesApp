import { autoinject, Aurelia } from 'aurelia-framework';
import {HttpClient, json, HttpClientConfiguration} from 'aurelia-fetch-client';
import {Note} from './../json/note';
import {User} from './../json/user';
import {Category} from './../json/category';

@autoinject
export class index {
  httpClient: HttpClient;

  notes = new Array<Note>();
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
            'Content-Type': 'application/json',
          }});
    });
    this.httpClient = httpClient;

    this.getData();
    this.updates();
  }

 // Calls both of the dropdown update methods
  updates() {
    this.updateCats();
    this.updateUsers();
  }

  // Updates category dropdowns with possible options
  updateCats() {
    this.cats = new Array<Category>();
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

  // Updates user dropdowns with possible options
  updateUsers() {
    this.users = new Array<User>();
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

  // Gets notes
  async getData() {
    console.log("GET called");
    this.notes = new Array<Note>();
    this.httpClient.fetch('notes', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        for(let entry of data) {
          var cat = new Category(entry.category.id, entry.category.name);
          var user = new User(entry.user.id, entry.user.email, entry.user.name, entry.user.createdOn);
          var note = new Note(entry.id, entry.title, entry.note, entry.createdOn, entry.categoryid, entry.isDeleted, entry.userid, cat, user);
          this.notes.push(note);
          this.index = note.id + 1;
        }
      })
  }

  // Adds a note
  putNote() {
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

      let exists = false;

      for(let note of this.notes) {
        if(note.id == this.newNote.id) {
          exists = true;
        }
      }

      // If Id already exists (and thus we're updating)
      if(exists)
      {
        console.log("PUT called");
        this.httpClient.fetch('notes/' + this.newNote.id, {
          method: 'PUT',
          body: JSON.stringify(this.newNote),
        })
        .then(data => {
          console.log(data);
          {
            this.getData();
          }
       });
      }
      else { // POST new
        console.log("POST called");
        this.httpClient.fetch('notes', {
          method: 'POST',
          body: JSON.stringify(this.newNote),
        })
        .then(data => {
          console.log(data);
          if(data.status == 200)
          {
            this.getData();
          }
       });
      }
      
    }
  }

  // Deletes a note
  deleteData(num) {
    console.log("DELETE called on Note: " + num);
    console.log(this.httpClient.baseUrl + 'notes/' + num);
    this.httpClient.fetch('notes/' + num, {
      method: 'DELETE'
    })
    .then(data => {
      console.log(data);
      if(data.status == 200)
      {
        this.getData();
      }
    });
  }

  // Refresh button (located in infotag)
  refreshPage() {
    window.location.reload();
  }
}
