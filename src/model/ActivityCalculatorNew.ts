import type { ActivityItem } from "@/domain/ActivityDataItems";
import type { DestinyClanProfile, DestinyUserProfile } from "@/domain/ProfileDataItems";
import type { Domain } from "@/domain/_Domain";
import { HtActivityType } from "@/services/HtAppService";
import { ActivityDensityTimeline } from "./ActivityDensityTimeline";
import type { BungieNetProvider } from "./BungieNetProvider";



export class ActivityCalculatorNew {
  
  _activityCodes: Map<HtActivityType, number>;
  
  constructor() {
    this._activityCodes = new Map<HtActivityType, number>();
    this._activityCodes.set(HtActivityType.All, 0);
    this._activityCodes.set(HtActivityType.Raids, 4);
    // this._activityCodes.set(HtActivityType.GMs, 0);
    // this._activityCodes.set(HtActivityType.All, 0);
    // this._activityCodes.set(HtActivityType.All, 0);
    // this._activityCodes.set(HtActivityType.All, 0);
  }
  
  
  async getClansActivityDensity(groups: DestinyClanProfile[], activityType: HtActivityType, minDate: Date, domain: Domain, bnetProvider: BungieNetProvider) {
    
    // 1. collect groups' users in one big list 'allusers'
    
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
    
    // 2. collect activities
    
    let activityDownloadTasks = new Array<Promise<ActivityItem[]>>
    for(let user of allUsers) {
      let p = bnetProvider.getActivities(user.characters, minDate);
      activityDownloadTasks.push(p);
    }
    
    console.log(`Loading activities from all users...`);
    let allActivityResults = await Promise.all(activityDownloadTasks);
    let actCount = 0;
    allActivityResults.forEach((u) => {actCount += u.length});
    console.log(`Loaded ${actCount} activities total`);
    
    // 3. add activities to timeline
    
    let timeline = new ActivityDensityTimeline(true, 'Activity density');
    
    for (let actarr of allActivityResults) {
      for (let act of actarr) {
        let dateStart = act.startDate;
        let dateEnd = new Date(act.startDate.getTime() + act.durationSeconds * 1000);
        
        let day1 = dateStart.getDay();
        let day2 = dateEnd.getDay();
        
        if (day1 == day2) {
          // let actTimeline = daysMap.get(day1)!;
          // actTimeline.increaseActivityCounters(dateStart, dateEnd);
          timeline.increaseActivityCounters(dateStart, dateEnd);
        }
        else {
          let borderDate1 = new Date(1900, 0, 1, 23, 59, 0);
          // let actTimeline1 = daysMap.get(day1)!;
          // actTimeline1.increaseActivityCounters(dateStart, borderDate1);
          let borderDate2 = new Date(1900, 0, 1, 0, 1, 0);
          // let actTimeline2 = daysMap.get(day2)!;
          // actTimeline2.increaseActivityCounters(borderDate2, dateEnd);
          
          timeline.increaseActivityCounters(dateStart, borderDate1);
          timeline.increaseActivityCounters(borderDate2, dateEnd);
        }
        
        timeline.totalActivityCount++;
        if (act.startDate < timeline.minActivityDate) { 
          timeline.minActivityDate = act.startDate; 
        }
        if (act.startDate > timeline.maxActivityDate) { 
          timeline.maxActivityDate = act.startDate;
        }
      }
    }
    
    timeline.fillNormalizedTimeline(0);
    
    return timeline;
    
  }
  
  
}