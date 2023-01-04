
import DestinyUserDescriptor from './DestinyUserDescriptor.js';


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
   * @param {String} endpoint 
   * @param {Object} data 
   * @returns {Object} json response
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
  
  
  async searchForUsers(searchText : string) {
    
    // https://bungie-net.github.io/multi/operation_post_Destiny2-SearchDestinyPlayerByBungieName.html#operation_post_Destiny2-SearchDestinyPlayerByBungieName
    // https://bungie-net.github.io/multi/operation_post_User-SearchByGlobalNamePost.html#operation_post_User-SearchByGlobalNamePost
    
    let path = '/User/Search/GlobalName/0/';
    let data = { displayNamePrefix: searchText };
    let response = await this.bungiePost(path, data);
    return response;
  }
  
  
  
}