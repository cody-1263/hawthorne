import type { DestinyUserProfile, DestinyClanProfile, DestinyCharacterProfile } from "./ProfileDataItems";



/** Domain of HT tool contains all user and clan profiles and relevant info within client session */
export class Domain {
  
  
  _userProfilesMap = new Map<string, DestinyUserProfile>();
  
  _clanProfilesMap = new Map<string, DestinyClanProfile>();
  
  
  
  /** Creates domain instance */
  constructor() {
    
    
    
  }
  
  
  
  
  /** Get destiny user, if it was saved in domain */
  getDestinyUser(destinyMembershipId:string) : DestinyUserProfile|null {
    
    if (this._userProfilesMap.has(destinyMembershipId)) {
      return this._userProfilesMap.get(destinyMembershipId)!;
    }
    else {
      return null;
    }
    
  }
  
  
  /** Get destiny clan, if it was saved in domain */
  getDestinyClan(groupId:string) : DestinyClanProfile|null {
    
    if (this._clanProfilesMap.has(groupId)) {
      return this._clanProfilesMap.get(groupId)!;
    }
    else {
      return null;
    }
    
  }
  
  
  /** Add destiny user */
  addDestinyUser(user:DestinyUserProfile) {
    this._userProfilesMap.set(user.destinyMembershipId, user);
  }
  
  
  /** Add destiny clan */
  addDestinyClan(clan:DestinyClanProfile) {
    this._clanProfilesMap.set(clan.groupId, clan);
  }
  
}