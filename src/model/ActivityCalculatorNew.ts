import type { ActivityItem } from "@/domain/ActivityDataItems";
import type { DestinyClanProfile, DestinyUserProfile } from "@/domain/ProfileDataItems";
import type { Domain } from "@/domain/_Domain";
import { HtActivityType, HtPeriodMode } from "@/services/HtAppService";
import ActivityDensityTimeline from "./ActivityDensityTimeline";
import type { BungieNetProvider } from "./BungieNetProvider";



export class ActivityCalculatorNew {
  
  _activityCodes: Map<HtActivityType, number>;
  
  constructor() {
    this._activityCodes = new Map<HtActivityType, number>();
    this._activityCodes.set(HtActivityType.All, 0);
    this._activityCodes.set(HtActivityType.Raids, 4);
    // this._activityCodes.set(HtActivityType.LostSector, 87);
    // this._activityCodes.set(HtActivityType.AllPvE, 7);
    // this._activityCodes.set(HtActivityType.DaresOfEternity, 85);
    // this._activityCodes.set(HtActivityType.TrialsOfOsiris, 84);
    // this._activityCodes.set(HtActivityType.AllPvP, 5);
    // this._activityCodes.set(HtActivityType.Dungeon, 82);
  }
  
  
  /** Download those clans activities */
  async getClansActivityDensity(groups: DestinyClanProfile[], activityType: HtActivityType, periodMode: HtPeriodMode, domain: Domain, bnetProvider: BungieNetProvider) {
    
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
    
    const minDate = this._getMinDate(periodMode);
    const activityCode = this._activityCodes.get(activityType)!;
    let activityDownloadTasks = new Array<Promise<ActivityItem[]>>
    for(let user of allUsers) {
      let p = bnetProvider.getActivities(user, minDate, activityCode);
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
  
  
  
  /** Calculate this user's activity density */
  async getUserActivityDensity(user: DestinyUserProfile, activityType: HtActivityType, periodMode: HtPeriodMode, domain: Domain, bnetProvider: BungieNetProvider) {
    
    const minDate = this._getMinDate(periodMode);
    const activityCode = this._activityCodes.get(activityType)!;
    
    const activities = await bnetProvider.getActivities(user, minDate, activityCode);
    
    
    
    const daysMap = new Map<number, ActivityDensityTimeline>();
    daysMap.set(0, new ActivityDensityTimeline(true, 'Sunday'));
    daysMap.set(1, new ActivityDensityTimeline(true, 'Monday'));
    daysMap.set(2, new ActivityDensityTimeline(true, 'Tuesday'));
    daysMap.set(3, new ActivityDensityTimeline(true, 'Wednesday'));
    daysMap.set(4, new ActivityDensityTimeline(true, 'Thusday'));
    daysMap.set(5, new ActivityDensityTimeline(true, 'Friday'));
    daysMap.set(6, new ActivityDensityTimeline(true, 'Saturday'));
    let sumActivityTimeline = new ActivityDensityTimeline(true, "ALL DAYS");
    sumActivityTimeline.minActivityDate = new Date();
    sumActivityTimeline.maxActivityDate = new Date(0);
    
    for (let item of activities) {
      let dateStart = item.startDate;
      let dateEnd = new Date(dateStart.getTime() + item.durationSeconds * 1000);
      
      let day1 = dateStart.getDay();
      let day2 = dateEnd.getDay();
      
      if (day1 == day2) {
        let actTimeline = daysMap.get(day1)!;
        actTimeline.increaseActivityCounters(dateStart, dateEnd);
        sumActivityTimeline.increaseActivityCounters(dateStart, dateEnd);
      }
      else {
        let borderDate1 = new Date(1900, 0, 1, 23, 59, 0);
        let actTimeline1 = daysMap.get(day1)!;
        actTimeline1.increaseActivityCounters(dateStart, borderDate1);
        let borderDate2 = new Date(1900, 0, 1, 0, 1, 0);
        let actTimeline2 = daysMap.get(day2)!;
        actTimeline2.increaseActivityCounters(borderDate2, dateEnd);
        
        sumActivityTimeline.increaseActivityCounters(dateStart, borderDate1);
        sumActivityTimeline.increaseActivityCounters(borderDate2, dateEnd);
      }
      
      sumActivityTimeline.totalActivityCount++;
      let activityDate = dateStart;
      if (activityDate < sumActivityTimeline.minActivityDate) { 
        sumActivityTimeline.minActivityDate = activityDate 
      }
      if (activityDate > sumActivityTimeline.maxActivityDate) { 
        sumActivityTimeline.maxActivityDate = activityDate 
      }
    }
    
    let maxCount = 0;
    for (let tl of daysMap){
      let maxc = tl[1].getMaxCounter();
      if (maxc > maxCount) maxCount = maxc;
    }
    for (let tl of daysMap){
      tl[1].fillNormalizedTimeline(maxCount);
    }
    sumActivityTimeline.fillNormalizedTimeline(0);
    
    let timelines = [sumActivityTimeline, daysMap.get(1)!, daysMap.get(2)!, daysMap.get(3)!, daysMap.get(4)!, daysMap.get(5)!, daysMap.get(6)!, daysMap.get(0)!];
    
    return timelines;
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