import {autoinject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Note} from './../json/note';

@autoinject
export class index {

  newNote = new Note("", "", "", "");
  notes = new Set<Note>();
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
    this.notes.clear();
    this.httpClient.fetch('notes', {
      method: 'get'
    })
      .then(response => response.json())
      .then(data => {
        for(let entry of data) {
          this.notes.add(new Note(entry.id, entry.title, entry.note, entry.createdOn));
          console.log(entry.title)
        }
      });
  }

  // Add user
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

  // Update user
  updateData() {
    console.log("PUT called");
    this.httpClient.fetch('notes', {
      method: 'put'})
      .then(response => response.json())
      .then(data => {
         console.log(data);
      });
  }

  // Delete user
  deleteData() {
    console.log("DELETE called");
    this.httpClient.fetch('notes', {
      method: 'delete'
    })
    .then(response => response.json())
      .then(data => {
         console.log(data);
      });
  }
}
