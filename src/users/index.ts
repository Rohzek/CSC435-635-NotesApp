import {autoinject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {User} from './../json/user';

@autoinject
export class index {
  users = new Array<User>();
  newUser = new User("", "", "", "");
  now = new Date();
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

  // Gets users
  async getData() {
    console.log("GET called");
    this.users = new Array<User>();
    this.httpClient.fetch('users', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        for(let entry of data) {
          var user = new User(entry.id, entry.email, entry.name, entry.createdOn);
          this.users.push(user);
          this.index = user.id + 1;
        }
      });
  }

  // Adds a user
  putUser() {
    this.newUser.createdOn = this.now;

    if(this.newUser.id == null || this.newUser.email == null || this.newUser.name == null || this.newUser.createdOn == null) {
      alert("Error!: Failed to make a new user, or edit a previous one. Please check all fields, and try again.");
    }
    else {
      let exists = false;
      
      for(let usr of this.users) {
        if(usr.id == this.newUser.id) {
          exists = true;
        }

        if(exists) {
          console.log("PUT called");
          this.httpClient.fetch('users/' + this.newUser.id, {
            method: 'PUT',
            body: JSON.stringify(this.newUser)
          })
          .then(data => {
            console.log(data);
            if(data.status == 200)
            {
              this.getData();
            }
          });
        }
        else {
          console.log("POST called");
          this.httpClient.fetch('users', {
            method: 'POST',
            body: JSON.stringify(this.newUser)
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
  }

  // Deletes a user
  deleteData(num) {
    console.log("DELETE called on User: " + num);
    this.httpClient.fetch('users/' + num, {
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
