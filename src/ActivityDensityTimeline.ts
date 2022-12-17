

/**
 * Class to store and edit activity counters for long periods of time 
 */
export class ActivityDensityTimeline {
  
  /** Timeline mode: long of one abstract day only */
  _oneDayMode : boolean;
  
  /** Timeline start Date value */
  _timelineStartDate : Date;
  
  /** Timeline item step size, in milliseconds */
  _stepSize : number;
  
  /** Array of activity counters */
  timeline : number[];
  
  /**
   * Constructor of ActivityDensityTimeline objects
   * @param startDate Timeline start Date value
   */
  constructor(oneDayMode : boolean) {
    this._oneDayMode = oneDayMode;
    this._stepSize = 600 * 1000;
    
    if (this._oneDayMode) {
      this._timelineStartDate = new Date(1900, 0, 1, 0, 0, 0);
      this.timeline = new Array<number>(144);
    }
    else {
      this._timelineStartDate = new Date(2020, 0, 1, 0, 0, 0);
      this.timeline = new Array<number>(1000000);
    }
    
    this.timeline.fill(0);
  }
  
  
  /**
   * Returns index to use in timeline array
   * @param date target date
   */
  getTimelineIndex(date : Date) {
    let targetDate = date;
    if (this._oneDayMode) {
      let hrs = date.getHours();
      let mnt = date.getMinutes();
      targetDate = new Date(1900, 0, 1, hrs, mnt, 0);
    }
    
    let diff = targetDate.getTime() - this._timelineStartDate.getTime();
    let stepsDouble = diff / this._stepSize;
    let index = Math.floor(stepsDouble);
    
    return index;
  }
  
  
  /**
   * Returns activity count at the specified time
   * @param date target date
   * @returns number of activities in that time
   */
  getActivityCount(date : Date) {
    let index = this.getTimelineIndex(date);
    return this.timeline[index];  
  }
  
  
  /**
   * Set activity counter at specified time to specified value
   * @param date target date
   * @param newValue new counter value
   */
  setActivityCount(date : Date, newValue : number) {
    let index = this.getTimelineIndex(date);
    this.timeline[index] = newValue;
  }
  
  
  /**
   * Increase activity counter at specified time by 1
   * @param date target date
   */
  increaseActivityCounter(date : Date) {
    let index = this.getTimelineIndex(date);
    this.timeline[index] += 1;
  }
  
  
  /**
   * Increase activity counter between specified times by 1
   * @param date target date
   */
  increaseActivityCounters(dateStart : Date, dateEnd : Date) {
    let index1 = this.getTimelineIndex(dateStart);
    let index2 = this.getTimelineIndex(dateEnd);
    for (let i = index1; i <= index2; i++) {
      this.timeline[i] += 1;
    }
  }
  
}