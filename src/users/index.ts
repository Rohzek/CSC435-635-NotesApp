import {autoinject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {User} from './../json/user';

@autoinject
export class index {
  users = new Set<User>();
  newUser = new User("", "", "", "");
  //now = new Date().toDateString();
  now = new Date().toLocaleString();
  index = 1;

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
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        for(let entry of data) {
          var user = new User(entry.id, entry.email, entry.name, entry.createdOn);
          this.users.add(user);
          this.index = user.id + 1;
        }
      });
  }

  // Add user
  postData() {
    console.log("POST called");
    this.httpClient.fetch('users', {
      method: 'POST'
    })
      .then(response => response.json())
      .then(data => {
         console.log(data);
      });
  }

  // Update user
  putData() {
    console.log("PUT called");
    this.httpClient.fetch('users', {
      method: 'PUT',
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
  deleteData(num) {
    console.log("DELETE called on User: " + num);
    this.httpClient.fetch('users/' + num, {
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
