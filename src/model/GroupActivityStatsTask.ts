import type { ActivityItem } from "@/domain/ActivityDataItems";
import { DestinyUserProfile, type DestinyClanProfile } from "@/domain/ProfileDataItems";
import type { Domain } from "@/domain/_Domain";
import { HtActivityType, HtPeriodMode } from "@/services/HtAppService";
import { ActivityDensityTimeline } from "./ActivityDensityTimeline";
import type { BungieNetProvider } from "./BungieNetProvider";


/**
 * Activity codes storage
 */
export class ActivityCodes {
  
  map: Map<number, HtActivityType>;
  
  links: Array<[type: HtActivityType, modeNumber: number]>;
  
  names: Map<HtActivityType, string>;
  
  constructor() {

    this.links = new Array<[HtActivityType, number]>;
    this.links.push([HtActivityType.TrialsOfOsiris, 84]);
    this.links.push([HtActivityType.DaresOfEternity, 85]);
    this.links.push([HtActivityType.Raids, 4]);
    this.links.push([HtActivityType.LostSector, 87]);
    this.links.push([HtActivityType.Dungeon, 82]);
    this.links.push([HtActivityType.AllPvP, 5]);
    this.links.push([HtActivityType.AllPvE, 7]);
    this.links.push([HtActivityType.All, 0]);
    
    this.map = new Map<HtActivityType, number>();
    for (let row of this.links) {
      this.map.set(row[1], row[0]);
    }
    
    this.names = new Map<HtActivityType, string>();
    this.names.set(HtActivityType.TrialsOfOsiris, "Trials of Osiris");
    this.names.set(HtActivityType.DaresOfEternity, "Dares of Eternity");
    this.names.set(HtActivityType.Raids, "Raid");
    this.names.set(HtActivityType.LostSector, "Lost Sector");
    this.names.set(HtActivityType.Dungeon, "Dungeon");
    this.names.set(HtActivityType.AllPvP, "AllPvP");
    this.names.set(HtActivityType.AllPvE, "AllPvE");
    this.names.set(HtActivityType.All, "All");
  }
  
}




/** 
 * Description of a player's group activity information 
 */
export class PlayerGroupActivitySummary {
  
  userProfile = new DestinyUserProfile();
  groupActivityTotalCount = 0;
  groupActivityTotalDurationSeconds = 0;
  groupActivities = new Array<GroupActivityData>();
  
}




/** 
 * Description of a group activity
 */
export class GroupActivityData {
  
  userProfiles = new Array<DestinyUserProfile>();
  startDate = new Date(2000, 1, 1);
  durationSeconds = -1;
  instanceId = '-1';
  referenceId = '-1';
  activityTypes = new Array<HtActivityType>();
  
}




/** 
 * Description of a group activity
 */
export class GroupActivityStatsResult {
  
  playerSummaries = new Array<PlayerGroupActivitySummary>();
  groupActivities = new Array<GroupActivityData>();
  
}




/**
 * 
 */
export class GroupActivityStatsTask {
  

  constructor() {

  }
  
  
  /** Download clans' group activities */
  async getClansGroupActivities(
    groups:       DestinyClanProfile[], 
    activityType: HtActivityType, 
    periodMode:   HtPeriodMode, 
    domain:       Domain, 
    bnetProvider: BungieNetProvider) {
    
    // 1. -------- collect groups' users in one big list 'allusers'
    
    console.log(`Loading users from ${groups.length} clans ...`);
    
    var usersPromises = new Array<Promise<DestinyUserProfile[]>>();
    for (var g of groups) {
      let p = bnetProvider.getClanMembers(g, domain);
      usersPromises.push(p);
    }
    
    let allUsers = new Array<DestinyUserProfile>();
    let userResults = await Promise.all(usersPromises);
    for (let arr of userResults) {
      for (let u of arr) allUsers.push(u);
    }
    
    let charCount = 0;
    allUsers.forEach((u) => {charCount += u.characters.length});
    console.log(`Found ${allUsers.length} users with ${charCount} characters`);
    
    // 2. -------- collect activities
    
    console.log(`Loading activities from all users...`);
    
    const activityCodes = new ActivityCodes();
    const minDate = this._getMinDate(periodMode);
    const activityCode = activityCodes.map.get(activityType)!;
    
    let activityDownloadTasks = new Array<Promise<ActivityItem[]>>
    for(let user of allUsers) {
      let p = bnetProvider.getActivities(user, minDate, activityCode);
      activityDownloadTasks.push(p);
    }
    
    let allActivityResults = await Promise.all(activityDownloadTasks);
    console.log(`All activities downloaded.`);
    
    // 3. -------- create all activity summaries
    
    let instancesMap = new Map<string, GroupActivityData>();
    
    for (let actArray of allActivityResults) {
      for (let act of actArray) {
        
        if (instancesMap.has(act.instanceId)) {
          var a = instancesMap.get(act.instanceId)!;
          if (a.userProfiles.includes(act.playerProfiles[0]) == false) {
            a.userProfiles.push(act.playerProfiles[0]);
          }
        }
        else {
          let a = new GroupActivityData();
          a.userProfiles.push(act.playerProfiles[0]);
          a.instanceId = act.instanceId;
          a.referenceId = act.referenceId;
          a.startDate = act.startDate;
          a.durationSeconds = act.durationSeconds;
          for (let modeItem of act.modes) {
            if (activityCodes.map.has(modeItem)) {
              a.activityTypes.push(activityCodes.map.get(modeItem)!);
            }
          }
          instancesMap.set(act.instanceId, a);
        }
      }
    }
    
    let allActivities = new Array<GroupActivityData>();
    for(let instance of instancesMap.values()) {
      allActivities.push(instance);
    }
    allActivities = allActivities.sort((a,b) => (b.startDate > a.startDate ? 1 : -1));
    
    // 4. -------- create list of group activities and map of group activities per player
    
    let allGroupActivitiesList = new Array<GroupActivityData>();
    let allPlayerSummaries = new Array<PlayerGroupActivitySummary>();
    let playerActivitySummariesMap = new Map<string, PlayerGroupActivitySummary>();
    
    for (let userProfile of allUsers) {
      let playerSummary = new PlayerGroupActivitySummary();
      playerSummary.userProfile = userProfile;
      playerSummary.groupActivityTotalCount = 0;
      playerSummary.groupActivityTotalDurationSeconds = 0;
      playerActivitySummariesMap.set(userProfile.bungieGlobalDisplayName, playerSummary);
      allPlayerSummaries.push(playerSummary);
    }
    
    for (let activity of allActivities) {
      
      if(activity.userProfiles.length < 3) {
        continue;
      }
        
      allGroupActivitiesList.push(activity);
      
      for (let userProfile of activity.userProfiles) {
        let summary = playerActivitySummariesMap.get(userProfile.bungieGlobalDisplayName)!;
        summary.groupActivityTotalCount += 1;
        summary.groupActivityTotalDurationSeconds += activity.durationSeconds;
        summary.groupActivities.push(activity);
      }
    }
    
    allPlayerSummaries = allPlayerSummaries.sort((a,b) => b.groupActivityTotalDurationSeconds - a.groupActivityTotalDurationSeconds);
    // console.log("SORTED PLAYER SUMMARIES");
    // console.log(allPlayerSummaries);
    // console.log("ALL GROUP ACTIVITIES");
    // console.log(allGroupActivitiesList);
    
    let result = new GroupActivityStatsResult();
    result.playerSummaries = allPlayerSummaries;
    result.groupActivities = allGroupActivitiesList;
    
    return result;
  }
  
  
  /** aorguihworguhweuahwegyhwuaehf */
  _getMinDate(periodMode: HtPeriodMode) {
    const currentDate = new Date();
    let minDate = new Date(0);
    if (periodMode == HtPeriodMode.OneYear) {
      minDate = new Date((new Date()).setFullYear(currentDate.getFullYear() - 1));
    }
    else if (periodMode == HtPeriodMode.SixMonths) {
      minDate = new Date((new Date()).setMonth(currentDate.getMonth() - 6));
    }
    else if (periodMode == HtPeriodMode.ThreeMonths) {
      minDate = new Date((new Date()).setMonth(currentDate.getMonth() - 3));
    }
    else if (periodMode == HtPeriodMode.OneMonth) {
      minDate = new Date((new Date()).setMonth(currentDate.getMonth() - 1));
    }
    else if (periodMode == HtPeriodMode.AllTime) {
      minDate = new Date(0);
    }
    
    return minDate;
  }
  
  
}