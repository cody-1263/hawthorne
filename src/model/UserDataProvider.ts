
import { DestinyUserDescriptor, DestinyCharacterDescriptor, DestinyClanDescriptor } from './DestinyUserDescriptor.js';


export default class UserDataProvider {
  
  
  
  /**
   * Get test array of users
   * @returns {DestinyUserDescriptor[]} array of users
   */
  GetUsersTest() {
    
    let arr = [];
    
    arr.push(new DestinyUserDescriptor());
    arr[0].bungieGlobalDisplayName = 'cody#1263';
    arr[0].displayName = 'cody';
    arr[0].iconPath = 'https://www.bungie.net/common/destiny2_content/icons/e958575e8bee5764e2f00ce34e121424.jpg';
    arr.push(new DestinyUserDescriptor());
    arr[1].bungieGlobalDisplayName = 'Knewklear#1263';
    arr[1].displayName = 'Knewklear';
    arr.push(new DestinyUserDescriptor());
    arr[2].bungieGlobalDisplayName = 'muggs#1393';
    arr[2].displayName = 'muggs';
    
    return arr;
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
   * Send POST to bungie.net
   * @param endpoint 
   * @param data 
   */
  async bungiePost(endpoint : string, data : any) {
    let bungoApiKey = '84e133a91eea4882b9a0bf6f404ef782';
    let parameters = { 
      headers: {  'X-API-Key': bungoApiKey}, 
      method: 'POST',
      body: JSON.stringify(data),
    };
    let apiRootPath = 'https://www.bungie.net/Platform';
    let url = apiRootPath + endpoint;
    let fetchResponse = await fetch(url, parameters);
    let reportJson = await fetchResponse.json();
    return reportJson;
  }
  
  
  
  
  /**
   * Finds bungie.net users using searchText and returns information about them
   * @param searchText search query
   * @returns 
   */
  async searchForUsers(searchText : string) {
    // https://bungie-net.github.io/multi/operation_post_User-SearchByGlobalNamePost
    
    let path = '/User/Search/GlobalName/0/';
    let data = { displayNamePrefix: searchText };
    let qres = await this.bungiePost(path, data);
    
    let arr = qres.Response.searchResults;
    
    let resultCollection = new Array<DestinyUserDescriptor>();
    let promiseCollection = new Array<Promise<void>>();
    for (let item of arr) { 
      for(let subitem of item.destinyMemberships) {
        let ud = new DestinyUserDescriptor();
        let name = subitem.bungieGlobalDisplayName;
        let code = this.codeNumberToText(subitem.bungieGlobalDisplayNameCode);
        ud.bungieGlobalDisplayName = `${name}#${code}`;
        ud.displayName = name;
        ud.nameCode = code;
        ud.membershipType = subitem.membershipType;
        ud.destinyMembershipId = subitem.membershipId;
        let prom = this.addDestinyCharactersData(ud);
        let prom2 = this.addDestinyClanData(ud);
        promiseCollection.push(prom);
        promiseCollection.push(prom2);
        resultCollection.push(ud);
        break;
      }
    }
    
    await Promise.all(promiseCollection);
    
    return resultCollection;
  }
  
  
  /**
   * Search for a player with their bungie name
   * @param searchText text query
   */
  async searchDestinyPlayerByBungieName(searchText : string) {
    // https://bungie-net.github.io/multi/operation_post_Destiny2-SearchDestinyPlayerByBungieName
    
    let textParts = searchText.split('#');
    let membershipType = 3;
    let path = `/Destiny2/SearchDestinyPlayerByBungieName/${membershipType}/`;
    let data = { displayName : textParts[0], displayNameCode : textParts[1] };
    let res = await this.bungiePost(path, data);
    
    let jsonObject = res.Response[0];
    
    if (jsonObject != null) {
      let userDescriptor = new DestinyUserDescriptor();
      userDescriptor.iconPath = jsonObject.iconPath;
      let name = jsonObject.bungieGlobalDisplayName;
      let code = this.codeNumberToText(jsonObject.bungieGlobalDisplayNameCode);
      userDescriptor.displayName = name;
      userDescriptor.nameCode = code;
      userDescriptor.bungieGlobalDisplayName = `${name}#${code}`;
      userDescriptor.destinyMembershipId = jsonObject.membershipId;
      userDescriptor.membershipType = jsonObject.membershipType;
      
      await this.addDestinyCharactersData(userDescriptor);
      await this.addDestinyClanData(userDescriptor);
      
      //console.log(userDescriptor);
      return userDescriptor;
    }
    else {
      return null;
    }
  }
  
  
  /**
   * 
   * @param descriptor 
   */
  async addDestinyCharactersData(descriptor : DestinyUserDescriptor) {
    
    let pathParams = '?components=200';
    let path = `/Destiny2/${descriptor.membershipType}/Profile/${descriptor.destinyMembershipId}/` + pathParams;
    
    let qres = await this.bungieGet(path);
    
    let mostRecentDate = new Date(0);
    
    if (qres.Response != null) {
      for (let property in qres.Response.characters.data) {
        let charJson = qres.Response.characters.data[property];
        
        let charDescriptor = new DestinyCharacterDescriptor();
        charDescriptor.characterId = charJson.characterId;
        charDescriptor.dateLastPlayed = new Date(charJson.dateLastPlayed);
        charDescriptor.minutesPlayedTotal = charJson.minutesPlayedTotal;
        charDescriptor.light = charJson.light;
        charDescriptor.emblemPath = 'https://www.bungie.net' + charJson.emblemPath;
        charDescriptor.emblemBackgroundPath = 'https://www.bungie.net' + charJson.emblemBackgroundPath;
        charDescriptor.classHash = charJson.classHash;
        if (charDescriptor.classHash == '3655393761')
          charDescriptor.className = 'Titan';
        else if (charDescriptor.classHash == '2271682572')
          charDescriptor.className = 'Warlock';
        else if (charDescriptor.classHash == '671679327')
          charDescriptor.className = 'Hunter';
        descriptor.characterDescriptors.push(charDescriptor);
        
        if (charDescriptor.dateLastPlayed > mostRecentDate) {
          descriptor.iconPath = charDescriptor.emblemPath;
          mostRecentDate = charDescriptor.dateLastPlayed;
        }
      }
    }
  }
  
  
  
  async addDestinyClanData(userDescriptor : DestinyUserDescriptor) {
    // https://bungie-net.github.io/multi/operation_get_GroupV2-GetGroupsForMember
    
    // let pt1 = '/GroupV2/3909446/';
    // let resultJson = await this.bungieGet(pt1);
    // console.log(resultJson);
    
    let mtype = userDescriptor.membershipType;
    let mid = userDescriptor.destinyMembershipId;
    let filter = 0;
    let groupType = 1;
    let endpoint = `/GroupV2/User/${mtype}/${mid}/${filter}/${groupType}/`;
    
    let resultJson = await this.bungieGet(endpoint);
    
    if (resultJson.Response != null && resultJson.Response.results != null && resultJson.Response.results.length > 0) {
      let clanDescriptor = new DestinyClanDescriptor();
      let clanJson = resultJson.Response.results[0].group;
      clanDescriptor.groupId = clanJson.groupId;
      clanDescriptor.name = clanJson.name;
      clanDescriptor.clanCallsign = clanJson.clanInfo.clanCallsign;
      userDescriptor.clanDescriptor = clanDescriptor;
    }
  }
  
  
  
  
  /**
  * Gets activities list of given account
  */
  async getActivities (membershipType: string, destinyMembershipId: string, characterId: string) {

    let endpoint = `/Destiny2/${membershipType}/Account/${destinyMembershipId}/Character/${characterId}/Stats/Activities/?count=249`;
    
    let resultJson = await this.bungieGet(endpoint);
    let activitiesJsonArray = resultJson.Response.activities;
  
    let items = new Array<ActivityRawItem>();
    
    for (const jsonItem of activitiesJsonArray) {
      
      let time = new Date(jsonItem.period).getTime();
      let durationSeconds = jsonItem.values.activityDurationSeconds.basic.value;
      let activityId = jsonItem.activityDetails.referenceId;
      
      let item = new ActivityRawItem(time, durationSeconds, activityId);
      items.push(item);
    }
    
    return items;
  }

  
  
  codeNumberToText(codeNumber : number) {
    let codeText = '0000';
    if (codeNumber < 10) {
      codeText = `000${codeNumber}`;
    }
    else if (codeNumber < 100) {
      codeText = `00${codeNumber}`;
    }
    else if (codeNumber < 1000) {
      codeText = `0${codeNumber}`;
    }
    else {
      codeText = `${codeNumber}`;
    }
    return codeText;
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