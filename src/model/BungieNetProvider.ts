
import { DestinyCharacterProfile, DestinyClanProfile, DestinyUserProfile } from "@/domain/ProfileDataItems";
import type { Domain } from "@/domain/_Domain";
import { ActivityItem } from "@/domain/ActivityDataItems";


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
        newProfileObject.bnetId = item.bungieNetMembershipId;
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
        userProfile.bnetId = bnetId;
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
   * Search for clans with their names
   * @param searchText text query
   */
  async searchForClans(searchText : string, domain : Domain) {
    
    let qText = `/GroupV2/Search/`;
    let qParams = { name : searchText, groupType : 1 };
    let qResult = await this.bungiePost(qText, qParams);
    
    //console.log(JSON.stringify(qResult));
    
    let resultCollection = new Array<DestinyClanProfile>();
    
    for (let jsonItem of qResult.Response.results) {
      let groupId = jsonItem.groupId;
      let groupName = jsonItem.name;
      let groupCallsign = jsonItem.clanInfo.clanCallsign;
      
      let group = domain.getDestinyClan(groupId);
      
      if (group == null) {
        group = new DestinyClanProfile();
        group.groupId = groupId;
        group.name = groupName;
        group.clanCallsign = groupCallsign;
        domain.addDestinyClan(group);
      }
      
      resultCollection.push(group);
    }
    
    return resultCollection;
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
        userProfile.characters.push(charDescriptor);
        
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
  
  
  
  
  /** Get list of clan members to use in further data analysis */
  async getClanMembers(clanProfile: DestinyClanProfile, domain: Domain) {
    
    // console.log(`Loading clan: ${clanProfile.name} ...`);
    
    let users = new Array<DestinyUserProfile>();
    let path = `/GroupV2/${clanProfile.groupId}/Members/`;
    let jres = await this.bungieGet(path);
    
    let characterLoadingTasks = new Array<Promise<void>>();
    
    for (let juser of jres.Response.results) {
      
      // console.log(juser);
      
      let bnetId = juser.bungieNetUserInfo.membershipId;
      let userProfile = domain.getDestinyUser(bnetId);
      
      if (userProfile == null) {
        userProfile = new DestinyUserProfile();
        userProfile.bnetId = juser.bungieNetUserInfo.membershipId;
        userProfile.displayName = juser.bungieNetUserInfo.bungieGlobalDisplayName;
        userProfile.nameCode = this.codeNumberToText(juser.bungieNetUserInfo.bungieGlobalDisplayNameCode);
        userProfile.bungieGlobalDisplayName = `${userProfile.displayName}#${userProfile.nameCode}`;
        userProfile.clanDescriptor = clanProfile;
        
        let memid = juser.destinyUserInfo.membershipId;
        let memtype = juser.destinyUserInfo.membershipType;
        let pr = this.addDestinyCharactersData(userProfile, domain, memid, memtype);
        characterLoadingTasks.push(pr);
        domain.addDestinyUser(userProfile);
      }

      users.push(userProfile);
    }

    await Promise.all(characterLoadingTasks);
    
    let allCharacters = new Array<DestinyCharacterProfile>();
    for (let u of users) {
      for (let c of u.characters) allCharacters.push(c);
    }
    
    // console.log(`Loaded clan: ${clanProfile.name} | ${users.length} members | ${allCharacters.length} characters`);
    
    return users;
  }
  
  
  
  
  
  
  
  
  /**  Gets a list of activities for given profile identifiers and limited by minDate */
  async getActivities (characterProfiles: DestinyCharacterProfile[], minDate : Date, activityType: number) {

    let activitiesCollection = new Array<ActivityItem>();
    
    for (let char of characterProfiles) {
      
      let memtype = char.membershipType;
      let memid = char.destinyMembershipId;
      let charid = char.characterId;
      let continueDownload = true;
      let endpoint = `/Destiny2/${memtype}/Account/${memid}/Character/${charid}/Stats/Activities/`;
      let pageSize = 249;
      let pageIndex = 0;
      while (continueDownload) {
        
        let q = `${endpoint}?count=${pageSize}&page=${pageIndex}&mode=${activityType}`;
        
        try {
          let resultJson = await this.bungieGet(q);
          
          // console.log(JSON.stringify(resultJson));
          let activitiesJsonArray = resultJson.Response.activities;
          continueDownload = activitiesJsonArray.length == pageSize;
            
          for (const jsonItem of activitiesJsonArray) {
            let item = new ActivityItem();
            item.referenceId = jsonItem.activityDetails.referenceId;
            item.startDate = new Date(jsonItem.period);
            item.durationSeconds = jsonItem.values.activityDurationSeconds.basic.value;
            
            if (item.startDate >= minDate) { activitiesCollection.push(item); }
            else { continueDownload = false; }
          }
          
          pageIndex++;
        }
        catch (error) {
          //console.log(error);
          //continueDownload = false;
          return activitiesCollection;
        }
      }
    }
    
    return activitiesCollection;
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