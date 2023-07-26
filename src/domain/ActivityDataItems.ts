import type { DestinyUserProfile } from "./ProfileDataItems";




/** basic activity history entry */
export class ActivityItem {
  
  /** start datetime */
  startDate : Date;
  
  /** duration in seconds */
  durationSeconds : number;
  
  /** mission id */
  referenceId : string;
  
  /** mission name */
  referenceName : string;
  
  /** director activity hash */
  directorActivityHash : string;
  
  /** instance id */
  instanceId : string;
  
  /** mode enum */
  mode : number;
  
  /** all relevant modes */
  modes : number[];
  
  /** all known bungieNetMembershipId values in this activity */
  players : string[];
  
  playerProfiles : DestinyUserProfile[];
  
  
  
  
  constructor() {
    this.startDate = new Date(0);
    // this.startTimeEpoch = Math.floor(this.startDate.getTime() / 1000);
    this.durationSeconds = 0;
    this.referenceId = '-1';
    this.referenceName = 'UNKNOWN';
    this.directorActivityHash = '-1';
    this.instanceId = '-1';
    this.mode = -1;
    this.modes = new Array<number>();
    this.players = new Array<string>();
    this.playerProfiles = new Array<DestinyUserProfile>();
  }
}








