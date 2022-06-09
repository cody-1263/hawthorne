import { BungieRequestHelper, ActivityRawItem } from './BungieDataSources';


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
    console.log(activeDays);
    return activeDays;
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