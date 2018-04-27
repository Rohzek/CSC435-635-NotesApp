import {autoinject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Note} from './../json/note';

@autoinject
export class index {
  categories = new Set<Note>();
  newUser = new Note("", "", "", "");

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
    this.categories.clear();
    this.httpClient.fetch('categories', {
      method: 'get'
    })
      .then(response => response.json())
      .then(data => {
        for(let entry of data) {
          this.categories.add(new Note(entry.id, entry.title, entry.note, entry.createdOn));
        }
      });
  }

  // Add user
  postData() {
    console.log("POST called");
    this.httpClient.fetch('categories', {
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
    this.httpClient.fetch('categories', {
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
    this.httpClient.fetch('categories', {
      method: 'delete'
    })
    .then(response => response.json())
      .then(data => {
         console.log(data);
      });
  }
}
