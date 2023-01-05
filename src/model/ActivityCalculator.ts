

import type { DestinyUserDescriptor, DestinyCharacterDescriptor } from '@/model/DestinyUserDescriptor';
import { ActivityDensityTimeline } from '@/model/ActivityDensityTimeline';
import UserDataProvider, { ActivityRawItem } from '@/model/UserDataProvider';


/**
 * 
 */
export class ActivityCalculator {
  
  
  async createDensityData(userDescriptor : DestinyUserDescriptor) {
    let membershipType = userDescriptor.membershipType;
		let destinyMembershipId = userDescriptor.destinyMembershipId;
		
    let dataProvider = new UserDataProvider();
    let activitiesCollection = new Array<ActivityRawItem>();
		for (let charDescriptor of userDescriptor.characterDescriptors) {
      let charId = charDescriptor.characterId;
      let activitiesBatch = await dataProvider.getActivities(membershipType, destinyMembershipId, charId);
      activitiesCollection = activitiesCollection.concat(activitiesBatch);
    }
		
    
		let densityObjects = this.calcActivityDensity(activitiesCollection);
    return densityObjects;
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
  
  
}