

import { Domain } from "@/domain/_Domain";
import { BungieNetProvider } from "@/model/BungieNetProvider";




export class HtServiceContainer {
  
  _domain : Domain;
  _bnetProvider : BungieNetProvider;
  
  
  constructor() {
    this._domain = new Domain();
    this._bnetProvider = new BungieNetProvider();
  }
  
  
  /** domain object with all cached info */
  get domain() { return this._domain; }
  
  /** bungie.net data fetcher */
  get bungieNetProvider() { return this._bnetProvider; }
  
}