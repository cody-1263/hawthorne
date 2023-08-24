import { htKeys } from '@/services/HtKeys';
import { ref, inject } from 'vue';
import { ActivityCalculatorNew } from '@/model/ActivityCalculatorNew';
import { HtActivityType, HtPeriodMode } from '@/services/HtAppService';
import { DestinyClanProfile } from '@/domain/ProfileDataItems';
import type { ActivityItem } from '@/domain/ActivityDataItems';
import type { HtServiceContainer } from '@/services/HtServiceContainer';
import type ActivityViewModel from './ActivityViewModel';
import ActivityPlayerViewModel from './ActivityPlayerViewModel';
import ActivityDensityTimeline from '@/model/ActivityDensityTimeline';




/**
 * The class that compiles activity list into activity distribution timelines
 */
export default class RaidActivityHelper {
  
  
  getDailyActivityDsictributionData(activityItems : ActivityViewModel[]) {
    
    let timeline = new ActivityDensityTimeline(true, 'Daily activity');
    
    for (let item of activityItems) {
      timeline.increaseActivityCounters(item.startDate, item.endDate);
    }
    timeline.fillNormalizedTimeline(-1);
    return timeline;
  }
  
  
  
}