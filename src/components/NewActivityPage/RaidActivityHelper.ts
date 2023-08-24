import { htKeys } from '@/services/HtKeys';
import { ref, inject } from 'vue';
import { ActivityCalculatorNew } from '@/model/ActivityCalculatorNew';
import { HtActivityType, HtPeriodMode } from '@/services/HtAppService';
import { DestinyClanProfile } from '@/domain/ProfileDataItems';
import type { ActivityItem } from '@/domain/ActivityDataItems';
import type { HtServiceContainer } from '@/services/HtServiceContainer';
import ActivityViewModel from './ActivityViewModel';
import ActivityPlayerViewModel from './ActivityPlayerViewModel';




export default class RaidActivityHelper {
  
  
  /**
   * Download and create vms for raid activities of Seismic Clans
   * @param serviceContainer Service container 
   * @returns Sorted activity viewmodels
   */
  async getActivities(serviceContainer : HtServiceContainer) {
    let activityData = await this.getRaidActivities(serviceContainer);
    let activityVms = await this.getActivityViewModels(activityData);
    return activityVms;
  }
  
 
  
  
  /** Get raid activities, filtered and sorted */
  async getRaidActivities(serviceContainer : HtServiceContainer) {

    let bnetProvider = serviceContainer._bnetProvider;
    let domain = serviceContainer.domain;
    
    let activityNames = new Map<string, string>();
    activityNames.set('910380154' ,'Deep Stone Crypt');
    activityNames.set('1441982566','Vow of the Disciple');
    activityNames.set('2122313384','Last Wish');
    activityNames.set('2381413764','Root of Nightmares');
    activityNames.set('3458480158','Garden of Salvation');
    activityNames.set('1374392663','King\'s Fall');
    activityNames.set('3881495763','Vault of Glass');
    
    
    
    let clan1 = new DestinyClanProfile();
    clan1.name = "Pathfinders";
    clan1.groupId = '3909446';
    clan1.clanCallsign = "SGP";
    let members1 = await bnetProvider.getClanMembers(clan1, domain);
    // 3285991
    let clan2 = new DestinyClanProfile();
    clan2.name = "Juggernauts";
    clan2.groupId = '3285991';
    clan2.clanCallsign = "SGJ";
    let members2 = await bnetProvider.getClanMembers(clan2, domain);
    
    let members = members1.concat(members2);
    
    var usersPromises = new Array<Promise<ActivityItem[]>>();
    
    for (let mem of members) {
      var activityDownloadPromise = bnetProvider.getActivities(mem, new Date('2023-01-01T03:24:00'), 4);
      usersPromises.push(activityDownloadPromise);
    }
    
    let allActivities = await Promise.all(usersPromises);
    
    let activitiesMap = new Map<string, ActivityItem>();
    
    for (let actArray of allActivities) {
      for (let act of actArray) {
        
        if (act.durationSeconds < 60 * 20) {continue;}
          
        
        if (!activitiesMap.has(act.instanceId)) {
          activitiesMap.set(act.instanceId, act);
          
          console.log(act.referenceId);
          if (activityNames.has(act.referenceId)) {
            act.referenceName = activityNames.get(act.referenceId)!;
          }
        }
        else {
          let domainAct = activitiesMap.get(act.instanceId)!;
          if (!domainAct.players.includes(act.players[0])) {
            domainAct.playerProfiles.push(act.playerProfiles[0]);
            domainAct.players.push(act.players[0]);
          }
        }
        
      }
    }
    
    let activitiesCollection = Array.from(activitiesMap.values()).filter(a => a.players.length >= 2);
    activitiesCollection.sort((a,b) => (a.startDate > b.startDate) ? -1 : 1);
    
    return activitiesCollection;
  }
  
  
  
  
  /** Get activity view models from downloaded data */
  async getActivityViewModels(activityData : ActivityItem[]) {
   
    let activityViewModelsCollection = new Array<ActivityViewModel>();
    
    for (let act of activityData) {
      let actVm = new ActivityViewModel();
      actVm.instanceId = act.instanceId;
      actVm.referenceName = act.referenceName == 'UNKNOWN' ? 'refid_' + act.referenceId : act.referenceName;
      actVm.referenceType = 'Raid';
      actVm.referenceColor = '#e63946';
      actVm.reportHyperlink = 'https://raid.report/pgcr/' + act.instanceId;
      actVm.durationText = this.getDurationDisplayText(act.durationSeconds);
      actVm.startDateText = this.getDateDisplayText(act.startDate);
      actVm.startDate = act.startDate;
      actVm.endDate = new Date(act.startDate.getTime() + act.durationSeconds * 1000);
      
      for (let i = 0; i < act.playerProfiles.length; i++) {
        let p = act.playerProfiles[i];
        let pVm = new ActivityPlayerViewModel();
        pVm.bnetId = p.bnetId;
        pVm.bungieGlobalDisplayName = p.bungieGlobalDisplayName;
        pVm.iconPath = p.iconPath;
        pVm.isTargetClanMember = true;
        actVm.players[i] = pVm;
      }
      
      activityViewModelsCollection.push(actVm);
    }
    
    return activityViewModelsCollection;
  }
  
  

  /** Get duration text from seconds */
  getDurationDisplayText(durationSeconds : number) {
    let hours = Math.floor(durationSeconds / 3600); 
    let minutes = Math.floor((durationSeconds % 3600) / 60);
    
    let text = hours > 0 ? `${hours} h ${minutes} m` : `${hours} h ${minutes} m`;
    return text;
  }
  
  /** Get date text from Date */
  getDateDisplayText(srcDate : Date) {
    
    let yyyy = srcDate.getFullYear();
    let month = srcDate.getMonth() + 1;
    let dd = srcDate.getDate() < 10 ? `0${srcDate.getDate()}` : `${srcDate.getDate()}`;
    let MMM = '  ';
    switch (month) {
      case 1: MMM = 'Jan'; break;
      case 2: MMM = 'Feb'; break;
      case 3: MMM = 'Mar'; break;
      case 4: MMM = 'Apr'; break;
      case 5: MMM = 'May'; break;
      case 6: MMM = 'Jun'; break;
      case 7: MMM = 'Jul'; break;
      case 8: MMM = 'Aug'; break;
      case 9: MMM = 'Sep'; break;
      case 10: MMM = 'Oct'; break;
      case 11: MMM = 'Nov'; break;
      case 12: MMM = 'Dec'; break;
    }

    let HH = srcDate.getHours() < 10 ? `0${srcDate.getHours()}` : `${srcDate.getHours()}`;
    let mm = srcDate.getMinutes() < 10 ? `0${srcDate.getMinutes()}` : `${srcDate.getMinutes()}`;
    
    let tzName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    let text = `${yyyy}-${MMM}-${dd} ${HH}:${mm} ${tzName}`;
    return text;
  }
  
}