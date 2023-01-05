
import { DestinyUserDescriptor, DestinyCharacterDescriptor } from './DestinyUserDescriptor.js';


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
        let code = subitem.bungieGlobalDisplayNameCode;
        ud.bungieGlobalDisplayName = `${name}#${code}`;
        ud.displayName = name;
        ud.membershipType = subitem.membershipType;
        ud.destinyMembershipId = subitem.membershipId;
        let prom = this.getDestinyCharactersData(ud);
        promiseCollection.push(prom);
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
      let code = jsonObject.bungieGlobalDisplayNameCode;
      userDescriptor.displayName = name;
      userDescriptor.bungieGlobalDisplayName = `${name}#${code}`;
      userDescriptor.destinyMembershipId = jsonObject.membershipId;
      userDescriptor.membershipType = jsonObject.membershipType;
      
      await this.getDestinyCharactersData(userDescriptor);
      
      //console.log(userDescriptor);
      return userDescriptor;
    }
    else {
      return null;
    }
  }
  
  
  async getDestinyCharactersData(descriptor : DestinyUserDescriptor) {
    
    let pathParams = '?components=200';
    let path = `/Destiny2/${descriptor.membershipType}/Profile/${descriptor.destinyMembershipId}/` + pathParams;
    
    let qres = await this.bungieGet(path);
    
    for (let property in qres.Response.characters.data) {
      let charJson = qres.Response.characters.data[property];
      
      let charDescriptor = new DestinyCharacterDescriptor();
      charDescriptor.characterId = charJson.characterId;
      charDescriptor.dateLastPlayed = charJson.dateLastPlayed;
      charDescriptor.minutesPlayedTotal = charJson.minutesPlayedTotal;
      charDescriptor.light = charJson.light;
      charDescriptor.emblemPath = 'https://www.bungie.net' + charJson.emblemPath;
      charDescriptor.emblemBackgroundPath = 'https://www.bungie.net' + charJson.emblemBackgroundPath;
      charDescriptor.classHash = charJson.classHash;
      if (charDescriptor.classHash == 3655393761)
        charDescriptor.className = 'Titan';
      else if (charDescriptor.classHash == 2271682572)
        charDescriptor.className = 'Warlock';
      else if (charDescriptor.classHash == 671679327)
        charDescriptor.className = 'Hunter';
      descriptor.characterDescriptors.push(charDescriptor);
    }
  }
  
  
  
}