

import { BungieRequestHelper, ActivityRawItem } from './BungieDataSources';
import { ActivityDensityTimeline } from './ActivityDensityTimeline';


/**
 * 
 */
export class ActivityAnalyst {
  
  
  async createActivityData() {
    let membershipType = '3';
		let destinyMembershipId = '4611686018505932007';
		
		let characterIdTitan   = '2305843009677775102';
		let characterIdWarlock = '2305843009697274837';
		let characterIdHunter  = '2305843009704634319';
		
		let brh = new BungieRequestHelper();
	  let activitiesTitan   = await brh.getActivities(membershipType, destinyMembershipId, characterIdTitan);
    let activitiesWarlock = await brh.getActivities(membershipType, destinyMembershipId, characterIdWarlock);
    let activitiesHunter  = await brh.getActivities(membershipType, destinyMembershipId, characterIdHunter);
    let activities = activitiesTitan.concat(activitiesWarlock, activitiesHunter);
    let activeDays =  this.createDayItems(activities);
    // console.log(activeDays);
    return activeDays;
  }
  
  
  
  async createDensityData() {
    let membershipType = '3';
		let destinyMembershipId = '4611686018505932007';
		
		let characterIdTitan   = '2305843009677775102';
		let characterIdWarlock = '2305843009697274837';
		let characterIdHunter  = '2305843009704634319';
		
		let brh = new BungieRequestHelper();
	  let activitiesTitan   = await brh.getActivities(membershipType, destinyMembershipId, characterIdTitan);
    let activitiesWarlock = await brh.getActivities(membershipType, destinyMembershipId, characterIdWarlock);
    let activitiesHunter  = await brh.getActivities(membershipType, destinyMembershipId, characterIdHunter);
    let activities = activitiesTitan.concat(activitiesWarlock, activitiesHunter);
    
    let densityObjects = this.calcActivityDensity(activities);
    return densityObjects;
  }
  
  
  /**
   * 
   * @param activityRawItems 
   */
  createDayItems(activityRawItems: Array<ActivityRawItem>) {
    
    // 1. sort items
    activityRawItems.sort(function(a,b){ return b.startTimeEpoch - a.startTimeEpoch; });
    
    let daysMap = new Map<number, ActivityDay>();
    let daysArray = new Array<ActivityDay>();
    
    // 2. start cycle
    for (let rawItem of activityRawItems) {
      
      let itemDateTime = new Date(rawItem.startTimeEpoch);
      let itemDate     = new Date(rawItem.startTimeEpoch);
      itemDate.setHours(0, 0, 0, 0);
      let itemDateEpoch = itemDate.getTime();
      
      // 2.3 Create new day item if there is none for the current day
      if (daysMap.has(itemDateEpoch) == false) {
        //console.log(itemDateEpoch);
        let caption = itemDate.toDateString();
        let ad = new ActivityDay(itemDate, caption);
        daysMap.set(itemDateEpoch, ad);
        daysArray.push(ad);
      }
      
      let day = daysMap.get(itemDateEpoch);
      let newActItem = new ActivityItem();
      
      let activityStartEpoch = itemDateTime.getTime();
      let dayDuration = day.dateTimeEndEpoch - day.dateTimeStartEpoch;
      
      newActItem.startPercent = (activityStartEpoch - day.dateTimeStartEpoch) / dayDuration;
      newActItem.durationPercent = (rawItem.durationSeconds * 1000) / dayDuration;
      
      day.activities.push(newActItem);
    }
    
    return daysArray;
  }
  
  
  
  /**
   * Return daily activity density
   * @param activityRawItems activity items
   * @returns 
   */
  calcActivityDensity(activityRawItems: ActivityRawItem[]) : ActivityDensityTimeline[] {
    
    let daysMap = new Map<number, ActivityDensityTimeline>();
    daysMap.set(0, new ActivityDensityTimeline(true, 'Sunday'));
    daysMap.set(1, new ActivityDensityTimeline(true, 'Monday'));
    daysMap.set(2, new ActivityDensityTimeline(true, 'Tuesday'));
    daysMap.set(3, new ActivityDensityTimeline(true, 'Wednesday'));
    daysMap.set(4, new ActivityDensityTimeline(true, 'Thusday'));
    daysMap.set(5, new ActivityDensityTimeline(true, 'Friday'));
    daysMap.set(6, new ActivityDensityTimeline(true, 'Saturday'));
    let sumActivityTimeline = new ActivityDensityTimeline(true, "ALL DAYS");
    
    for (let item of activityRawItems) {
      let dateStart = new Date(item.startTimeEpoch);
      let dateEnd = new Date(item.startTimeEpoch + item.durationSeconds * 1000);
      
      let day1 = dateStart.getDay();
      let day2 = dateEnd.getDay();
      
      if (day1 == day2) {
        let actTimeline = daysMap.get(day1);
        actTimeline.increaseActivityCounters(dateStart, dateEnd);
        sumActivityTimeline.increaseActivityCounters(dateStart, dateEnd);
      }
      else {
        let borderDate1 = new Date(1900, 0, 1, 23, 59, 0);
        let actTimeline1 = daysMap.get(day1);
        actTimeline1.increaseActivityCounters(dateStart, borderDate1);
        let borderDate2 = new Date(1900, 0, 1, 0, 1, 0);
        let actTimeline2 = daysMap.get(day2);
        actTimeline2.increaseActivityCounters(borderDate2, dateEnd);
        
        sumActivityTimeline.increaseActivityCounters(dateStart, borderDate1);
        sumActivityTimeline.increaseActivityCounters(borderDate2, dateEnd);
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
    
    let timelines = [sumActivityTimeline, daysMap.get(1), daysMap.get(2), daysMap.get(3), daysMap.get(4), daysMap.get(5), daysMap.get(6), daysMap.get(0)];
    
    return timelines;
  }
  
  
}




/**
 * 
 */
export class ActivityDay {
  caption : string;
  date : Date;
  dateTimeStartEpoch: number;
  dateTimeEndEpoch: number;
  activities: Array<ActivityItem>;
  constructor(date: Date, caption: string) {
    this.date = date;
    this.caption = caption;
    this.activities = new Array<ActivityItem>();
    this.dateTimeStartEpoch = this.date.getTime();
    this.dateTimeEndEpoch = this.dateTimeStartEpoch + (24 * 60 * 60 * 1000);
  }
}




/**
 * 
 */
export class ActivityItem {
  startPercent: number;
  durationPercent: number;
}