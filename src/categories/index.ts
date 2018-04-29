import {autoinject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Category} from './../json/category';

@autoinject
export class categoryIndex {
  categories = new Set<Category>();
  newUser = new Category("", "");
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
    this.categories.clear();
    this.httpClient.fetch('categories', {
      method: 'get'
    })
      .then(response => response.json())
      .then(data => {
        for(let entry of data) {
          var cat = new Category(entry.id, entry.name);
          this.categories.add(cat);
          this.index = cat.id + 1;
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
  putData() {
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
  deleteData(num) {
    console.log("DELETE called on Category: " + num);
    this.httpClient.fetch('categories/' + num, {
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
