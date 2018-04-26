import {autoinject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import 'fetch';

@autoinject
export class index {

  constructor(private httpClient: HttpClient) {
    httpClient.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl('https://notesapiassignment7.azurewebsites.net/api/');
    });
  }

  // Get user
  async getData() {
    this.httpClient.fetch('notes')
      .then(response => response.json())
      .then(data => {
         console.log(data);
      });
  }

  // Add user
  postData(){}

  // Update user
  updateData(){}

  // Delete user
  deleteData(){}
}
