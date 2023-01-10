



/** basic activity history entry */
export class ActivityRawItem {
  
  /** start datetime */
  startDate : Date;
  
  /** duration in seconds */
  durationSeconds : number;
  
  /** mission id */
  referenceId : string;
  
  /** director activity hash */
  directorActivityHash : string;
  
  /** instance id */
  instanceId : string;
  
  /** mode enum */
  mode : number;
  
  /** all relevant modes */
  modes : number[];
  
  
  
  
  constructor() {
    this.startDate = new Date(0);
    // this.startTimeEpoch = Math.floor(this.startDate.getTime() / 1000);
    this.durationSeconds = 0;
    this.referenceId = '-1';
    this.directorActivityHash = '-1';
    this.instanceId = '-1';
    this.mode = -1;
    this.modes = new Array<number>();
  }
}