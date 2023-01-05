



/**
 * Description of destiny user for the search panel
 */
export class DestinyUserDescriptor {

  bungieGlobalDisplayName : string;
  displayName : string;
  iconPath : string;
  
  destinyMembershipId : number;
  membershipType : number;
  
  characterDescriptors : DestinyCharacterDescriptor[];
  
  
  constructor() {
    this.bungieGlobalDisplayName = 'unknown#7777';
    this.displayName = 'unknown';
    this.iconPath = 'https://destinyemblemcollector.b-cdn.net/destiny1/5820d41ea5dcce690e44dc325841b151.jpg';
    
    this.destinyMembershipId = -1;
    this.membershipType = -1;
    
    this.characterDescriptors = new Array<DestinyCharacterDescriptor>();
  }
  
}



/**
 * Description of a Destiny 2 character
 */
export class DestinyCharacterDescriptor {
  
  characterId : number;
  dateLastPlayed : Date;
  minutesPlayedTotal : number;
  light : number;
  emblemPath : string;
  emblemBackgroundPath : string;
  classHash: number;
  className: string;
  
  constructor() {
    this.characterId = -1;
    this.dateLastPlayed = new Date(0);
    this.minutesPlayedTotal = -1;
    this.light = -1;
    this.emblemPath = 'https://destinyemblemcollector.b-cdn.net/destiny1/5820d41ea5dcce690e44dc325841b151.jpg';
    this.emblemBackgroundPath = 'https://destinyemblemcollector.b-cdn.net/destiny1/5820d41ea5dcce690e44dc325841b151.jpg';
    this.classHash = -1;
    this.className = 'unknown';
  }
  
}


