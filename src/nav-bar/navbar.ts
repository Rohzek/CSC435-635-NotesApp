import {bindable} from 'aurelia-framework';
import {containerless} from 'aurelia-framework';

@containerless
export class NavBar {
  @bindable router = null;
}
