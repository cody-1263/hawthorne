

import { Domain } from "@/domain/_Domain";
import { BungieNetProvider } from "@/model/BungieNetProvider";
import { HtAppService } from "./HtAppService";




export class HtServiceContainer {
  
  _domain : Domain;
  _bnetProvider : BungieNetProvider;
  _htAppService : HtAppService;
  
  
  constructor() {
    this._domain = new Domain();
    this._bnetProvider = new BungieNetProvider();
    this._htAppService = new HtAppService();
  }
  
  
  /** domain object with all cached info */
  get domain() { return this._domain; }
  
  /** bungie.net data fetcher */
  get bungieNetProvider() { return this._bnetProvider; }
  
  /** ht application service */
  get htAppService() { return this._htAppService; }
  
}




/** HT app research object: do we work with users or clans currently */
export enum HtApplicationResearchObjectMode {
  SingleUser,
  ClanCollection,
}