import {autoinject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Category} from './../json/category';

@autoinject
export class categoryIndex {
  categories = new Array<Category>();
  newCat = new Category("", "");
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
    this.categories = new Array<Category>();
    this.httpClient.fetch('categories', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        for(let entry of data) {
          var cat = new Category(entry.id, entry.name);
          this.categories.push(cat);
          this.index = cat.id + 1;
        }
      });
  }

  // Add user
  putCat() {
    if(this.newCat.id == null || this.newCat.name == null) {
      alert("Error!: Failed to make a new category, or edit a previous one. Please check all fields, and try again.");
    }
    else {
      let exists = false;
      
      for(let cat of this.categories) {
        if(cat.id == this.newCat.id) {
          exists = true;
        }

        if(exists) {
          console.log("PUT called");
          this.httpClient.fetch('categories/' + this.newCat.id, {
            method: 'PUT',
            body: JSON.stringify(this.newCat)
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
          this.httpClient.fetch('categories', {
            method: 'POST',
            body: JSON.stringify(this.newCat)
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

  // Delete user
  deleteData(num) {
    console.log("DELETE called on Category: " + num);
    this.httpClient.fetch('categories/' + num, {
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
