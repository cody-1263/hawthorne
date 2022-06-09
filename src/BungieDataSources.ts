  
  export class BungieRequestHelper {
    
    apiToken: string;
    
    constructor() {
      this.apiToken = '84e133a91eea4882b9a0bf6f404ef782';
    }
    
    async bungieGet(endpoint) {
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
    async getActivities () {
      
      let membershipType = '3';
      let destinyMembershipId = '4611686018505932007';
      let characterId = '2305843009704634319';
      
      let endpoint = `/Destiny2/${membershipType}/Account/${destinyMembershipId}/Character/${characterId}/Stats/Activities`;
      // endpoint += '?count=2&mode=4';
      
      let resultJson = await this.bungieGet(endpoint);
      let activitiesJsonArray = resultJson.Response.activities;
      console.log(activitiesJsonArray);
    
      
      for (const jsonItem of activitiesJsonArray) {
        let time = new Date(jsonItem.period).getTime();
        let durationSeconds = jsonItem.values.activityDurationSeconds.basic.value;
        let activityId = jsonItem.activityDetails.referenceId;
        
        let dataString = `${time} // ${durationSeconds} // ${activityId}`;
        console.log(dataString);
      }
    }
    
    async getCharacters(membershipType: string, membershipId: string) {
      let endpoint = `/Platform/Destiny2/${membershipType}/Profile/${membershipId}/LinkedProfiles/`;
      
      
    }
    
  }