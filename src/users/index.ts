import {autoinject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Note} from './../json/note';

@autoinject
export class index {
  users = new Set<Note>();
  newUser = new Note("", "", "", "");
  now = new Date().toDateString();

  constructor(private httpClient: HttpClient) {
    httpClient.configure(config => {
      config
        .withBaseUrl('https://notesapiassignment7.azurewebsites.net/api/')
        .withDefaults({
          headers: {
            'Content-Type': 'application/json',
          }});
    });

    this.getData();
  }

  // Get user
  async getData() {
    console.log("GET called");
    this.users.clear();
    this.httpClient.fetch('users', {
      method: 'get'
    })
      .then(response => response.json())
      .then(data => {
        for(let entry of data) {
          this.users.add(new Note(entry.id, entry.title, entry.note, entry.createdOn));
        }
      });
  }

  // Add user
  postData() {
    console.log("POST called");
    this.httpClient.fetch('users', {
      method: 'post'
    })
      .then(response => response.json())
      .then(data => {
         console.log(data);
      });
  }

  // Update user
  updateData() {
    console.log("PUT called");
    this.httpClient.fetch('users', {
      method: 'put',
      body: json({
        title: 'foo',
        body: 'bar',
        userId: 1
      })
    })
      .then(response => response.json())
      .then(data => {
         console.log(data);
      });
  }

  // Delete user
  deleteData() {
    console.log("DELETE called");
    this.httpClient.fetch('users', {
      method: 'delete'
    })
    .then(response => response.json())
      .then(data => {
         console.log(data);
      });
  }
}
