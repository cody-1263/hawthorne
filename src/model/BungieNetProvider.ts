
import { DestinyCharacterProfile, DestinyClanProfile, DestinyUserProfile } from "@/domain/ProfileDataItems";
import type { Domain } from "@/domain/_Domain";


export class BungieNetProvider {
  
  
  
  
  /**
   * Finds bungie.net users using searchText and returns information about them
   * @param searchText search query
   * @returns 
   */
  async searchForUsers(searchText : string, domain : Domain) {
    // https://bungie-net.github.io/multi/operation_post_User-SearchByGlobalNamePost
    
    let path = '/User/Search/GlobalName/0/';
    let data = { displayNamePrefix: searchText };
    let qres = await this.bungiePost(path, data);
    
    let arr = qres.Response.searchResults;
    
    let resultCollection = new Array<DestinyUserProfile>();
    let promiseCollection = new Array<Promise<void>>();
    for (let item of arr) { 
      
      let id = item.bungieNetMembershipId as string;
      let existingUser = domain.getDestinyUser(id);
      
      if (existingUser != null) {
        
        resultCollection.push(existingUser);
        
      }
      else {
        
        let newProfileObject = new DestinyUserProfile();
        let name = item.bungieGlobalDisplayName;
        let code = this.codeNumberToText(item.bungieGlobalDisplayNameCode);
        newProfileObject.bungieNetMembershipId = item.bungieNetMembershipId;
        newProfileObject.bungieGlobalDisplayName = `${name}#${code}`;
        newProfileObject.displayName = name;
        newProfileObject.nameCode = code;
        
        for(let ms of item.destinyMemberships) {
          let mid = ms.membershipId;
          let mtype = ms.membershipType;
          let prom = this.addDestinyCharactersData(newProfileObject, domain, mid, mtype);
          promiseCollection.push(prom);
          let prom2 = this.addDestinyClanData(newProfileObject, domain, mid, mtype);
          promiseCollection.push(prom2);
        }
        
        resultCollection.push(newProfileObject);
        domain.addDestinyUser(newProfileObject);
        
      }
    }
    
    await Promise.all(promiseCollection);
    
    return resultCollection;
  }
  
  
  /**
   * Search for a player with their bungie name
   * @param searchText text query
   */
  async searchDestinyPlayerByBungieName(searchText : string, domain : Domain) {
    // https://bungie-net.github.io/multi/operation_post_Destiny2-SearchDestinyPlayerByBungieName
    
    let textParts = searchText.split('#');
    let membershipType = 3;
    let path = `/Destiny2/SearchDestinyPlayerByBungieName/${membershipType}/`;
    let data = { displayName : textParts[0], displayNameCode : textParts[1] };
    let res = await this.bungiePost(path, data);
    
    let jsonObject = res.Response[0];
    
    if (jsonObject != null) {
      
      let mid = jsonObject.membershipId;
      let mtype = jsonObject.membershipType;
      
      let pathLP = `/Destiny2/${mtype}/Profile/${mid}/LinkedProfiles/`;
      let linkedProfiles = await this.bungieGet(pathLP);
      let bnetId = linkedProfiles.Response.bnetMembership.membershipId;
      
      let userProfile = domain.getDestinyUser(bnetId);
      
      if (userProfile == null) {
        userProfile = new DestinyUserProfile();
        userProfile.iconPath = jsonObject.iconPath;
        let name = jsonObject.bungieGlobalDisplayName;
        let code = this.codeNumberToText(jsonObject.bungieGlobalDisplayNameCode);
        userProfile.bungieNetMembershipId = bnetId;
        userProfile.displayName = name;
        userProfile.nameCode = code;
        userProfile.bungieGlobalDisplayName = `${name}#${code}`;
        domain.addDestinyUser(userProfile);
      }

      await this.addDestinyCharactersData(userProfile, domain, mid, mtype);
      await this.addDestinyClanData(userProfile, domain, mid, mtype);
      
      return userProfile;
    }
    else {
      return null;
    }
  }
  
  
  /**
   * 
   * @param userProfile 
   */
  async addDestinyCharactersData(userProfile : DestinyUserProfile, domain : Domain, destinyMembershipId : string, membershipType : string) {
    
    let pathParams = '?components=200';
    let path = `/Destiny2/${membershipType}/Profile/${destinyMembershipId}/` + pathParams;
    
    let qres = await this.bungieGet(path);
    
    let mostRecentDate = new Date(0);
    
    if (qres.Response != null) {
      for (let property in qres.Response.characters.data) {
        let charJson = qres.Response.characters.data[property];
        
        let charDescriptor = new DestinyCharacterProfile();
        charDescriptor.destinyMembershipId = destinyMembershipId;
        charDescriptor.membershipType = membershipType;
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
        userProfile.characterDescriptors.push(charDescriptor);
        
        if (charDescriptor.dateLastPlayed > mostRecentDate) {
          userProfile.iconPath = charDescriptor.emblemPath;
          mostRecentDate = charDescriptor.dateLastPlayed;
        }
      }
    }
  }
  
  
  
  async addDestinyClanData(userProfile : DestinyUserProfile, domain : Domain, membershipId : string, membershipType : string) {
    // https://bungie-net.github.io/multi/operation_get_GroupV2-GetGroupsForMember
    
    let filter = 0;
    let groupType = 1;
    let endpoint = `/GroupV2/User/${membershipType}/${membershipId}/${filter}/${groupType}/`;
    
    let resultJson = await this.bungieGet(endpoint);
    
    if (resultJson.Response != null && resultJson.Response.results != null && resultJson.Response.results.length > 0) {
      
      let clanJson = resultJson.Response.results[0].group;
      let groupId = clanJson.groupId as string;
      
      let existingClanObject = domain.getDestinyClan(groupId);
      
      if (existingClanObject != null) {
        userProfile.clanDescriptor = existingClanObject;
      }
      else {
        let newClanObject = new DestinyClanProfile();
        newClanObject.groupId = groupId;
        newClanObject.name = clanJson.name;
        newClanObject.clanCallsign = clanJson.clanInfo.clanCallsign;
        userProfile.clanDescriptor = newClanObject;
        domain.addDestinyClan(newClanObject);
      }
    }
  }
  
  
  
  
  
  
  
  
  /**
   * Send GET to bungie.net
   * @param endpoint 
   * @returns 
   */
  async bungieGet(endpoint : string) {
    let xak = this.getSomeWeirdText();
    let bungoParam = { headers: {  'X-API-Key': xak} };
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
    let xak = this.getSomeWeirdText();
    let parameters = { 
      headers: {  'X-API-Key': xak}, 
      method: 'POST',
      body: JSON.stringify(data),
    };
    let apiRootPath = 'https://www.bungie.net/Platform';
    let url = apiRootPath + endpoint;
    let fetchResponse = await fetch(url, parameters);
    let reportJson = await fetchResponse.json();
    return reportJson;
  }
  
  /** gets some weird text */
  getSomeWeirdText() : string {
    return '84e133a91eea4882b9a0bf6f404ef782';
  }
  
  /**  */
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