import type { DestinyUserProfile, DestinyClanProfile, DestinyCharacterProfile } from './ProfileDataItems';
import type { ActivityItem } from './ActivityDataItems';



/** Domain of HT tool contains all user and clan profiles and relevant info within client session */
export class Domain {
  
  
  _userProfilesMap = new Map<string, DestinyUserProfile>();
  
  _clanProfilesMap = new Map<string, DestinyClanProfile>();
  
  _activitiesMap = new Map<string, ActivityItem>();
  
  
  
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
  
  
  /** Get activity item, if it was saved in domain */
  getActivity(instanceId:string) : ActivityItem|null {
    
    if (this._activitiesMap.has(instanceId)) {
      return this._activitiesMap.get(instanceId)!;
    }
    else {
      return null;
    }
    
  }
  
  
  /** Add destiny user */
  addDestinyUser(user:DestinyUserProfile) {
    this._userProfilesMap.set(user.bnetId, user);
  }
  
  
  /** Add destiny clan */
  addDestinyClan(clan:DestinyClanProfile) {
    this._clanProfilesMap.set(clan.groupId, clan);
  }
  
  /** Add activity item */
  addActivity(activity:ActivityItem) {
    this._activitiesMap.set(activity.instanceId, activity);
  }
  
}