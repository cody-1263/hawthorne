

import { Domain } from "@/domain/_Domain";




export class HtServiceContainer {
  
  _domain : Domain;
  
  constructor() {
    this._domain = new Domain();
  }
  
  get domain() { return this._domain; }
  
}