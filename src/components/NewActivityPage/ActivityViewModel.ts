import ActivityPlayerViewModel from "./ActivityPlayerViewModel";




export default class ActivityViewModel {
  
  startDateText = '1999-09-08 22:15';
  durationText = '-24 hours';
  
  referenceName = 'UNK_Activity';
  referenceType = 'UNK_Type';
  referenceColor = '#fc0ab3';
  
  instanceId = '-12345678';
  reportHyperlink = '_';
  

  players = new Array<ActivityPlayerViewModel>();
  
  constructor() {
    let stubPlayer = new ActivityPlayerViewModel();
    stubPlayer.bungieGlobalDisplayName = 'someone';
    stubPlayer.isTargetClanMember = false;
    
    this.players.push(stubPlayer);
    this.players.push(stubPlayer);
    this.players.push(stubPlayer);
    this.players.push(stubPlayer);
    this.players.push(stubPlayer);
    this.players.push(stubPlayer);
  }

}