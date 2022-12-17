

// get activity
// https://data.destinysets.com/api/Destiny2.GetActivityHistory?membershipType=3&destinyMembershipId=4611686018505932007&characterId=2305843009704634319&count=249

// get characters
// https://data.destinysets.com/api/Destiny2.GetProfile?membershipType=3&destinyMembershipId=4611686018505932007&components=200

import { ActivityDensityTimeline } from './ActivityDensityTimeline';




export class BungieRequestHelper {
  
  apiToken: string;
  
  constructor() {
    this.apiToken = '84e133a91eea4882b9a0bf6f404ef782';
  }
  

  async bungieGet(endpoint : string) {
    let bungoApiKey = '84e133a91eea4882b9a0bf6f404ef782';
    let bungoParam = { headers: {  'X-API-Key': bungoApiKey} };
    let apiRootPath = 'https://www.bungie.net/Platform';
    let url = apiRootPath + endpoint;
    let fetchResponse = await fetch(url, bungoParam);
    let reportJson = await fetchResponse.json();
    return reportJson;
  }
  
  /**
   * Gets activities list of given account
   */
  async getActivities (membershipType: string, destinyMembershipId: string, characterId: string) {

    let endpoint = `/Destiny2/${membershipType}/Account/${destinyMembershipId}/Character/${characterId}/Stats/Activities/?count=249`;
    
    let resultJson = await this.bungieGet(endpoint);
    let activitiesJsonArray = resultJson.Response.activities;
    //console.log(activitiesJsonArray);
  
    let items = new Array<ActivityRawItem>();
    
    for (const jsonItem of activitiesJsonArray) {
      
      let time = new Date(jsonItem.period).getTime();
      let durationSeconds = jsonItem.values.activityDurationSeconds.basic.value;
      let activityId = jsonItem.activityDetails.referenceId;
      
      // if (this._mybool) {
        
      //   let adt = new ActivityDensityTimeline(true);
        
      //   let myDate = new Date('2022-12-17T00:11:00.000+03:00');
      //   let myDat2e = new Date('2022-06-15T00:19:00.000+03:00');
      //   adt.increaseActivityCounter(myDate);
      //   adt.increaseActivityCounter(myDat2e);
        
      //   console.log(adt.timeline);
        
      //   this._mybool = false;
      // }
      
      let item = new ActivityRawItem(time, durationSeconds, activityId);
      items.push(item);
      
      //let dataString = `${time} // ${durationSeconds} // ${activityId}`;
      //console.log(dataString);
    }
    
    return items;
  }
  
  _mybool : boolean = true;
  
  
  
  
  /**
   * Gets characters of given account
   * @param membershipType 
   * @param membershipId 
   */
  async getCharacters(membershipType: string, membershipId: string) {
    let endpoint = `/Destiny2/${membershipType}/Profile/${membershipId}/LinkedProfiles/`;
    let requestResult = await this.bungieGet(endpoint);
    let dataJson = requestResult.Response;
    // console.log(dataJson);
  }
  
}




/**
 * Basic activity description
 */
export class ActivityRawItem {
  
  startTimeEpoch: number;
  durationSeconds: number;
  activityId: number;
  
  constructor(startTimeEpoch: number, durationSeconds: number, activityId: number) {
    this.startTimeEpoch = startTimeEpoch;
    this.durationSeconds = durationSeconds;
    this.activityId = activityId;
  }
  
}