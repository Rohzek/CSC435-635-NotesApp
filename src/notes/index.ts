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

  now = new Date().toLocaleString();
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
        console.log(data);
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
        console.log(data);
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
  postData() {
    console.log("POST called");
    this.httpClient.fetch('notes', {
      method: 'post',
      body: json({
      })
    })
      .then(response => response.json())
      .then(data => {
         console.log(data);
      });
  }

  // Update note
  putData() {
    console.log("PUT called");
    this.httpClient.fetch('notes', {
      method: 'put'})
      .then(response => response.json())
      .then(data => {
         console.log(data);
      });
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
