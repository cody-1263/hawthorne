



/**
 * Description of destiny user for the search panel
 */
export class DestinyUserDescriptor {

  bungieGlobalDisplayName : string;
  displayName : string;
  iconPath : string;
  
  destinyMembershipId : string;
  membershipType : string;
  
  characterDescriptors : DestinyCharacterDescriptor[];
  clanDescriptor : DestinyClanDescriptor | null;
  
  
  constructor() {
    this.bungieGlobalDisplayName = 'unknown#7777';
    this.displayName = 'unknown';
    this.iconPath = 'https://destinyemblemcollector.b-cdn.net/destiny1/5820d41ea5dcce690e44dc325841b151.jpg';
    
    this.destinyMembershipId = '';
    this.membershipType = '';
    
    this.characterDescriptors = new Array<DestinyCharacterDescriptor>();
    this.clanDescriptor = null;
  }
  
}



/**
 * Description of a Destiny 2 character
 */
export class DestinyCharacterDescriptor {
  
  characterId : string;
  dateLastPlayed : Date;
  minutesPlayedTotal : number;
  light : number;
  emblemPath : string;
  emblemBackgroundPath : string;
  classHash: string;
  className: string;
  
  constructor() {
    this.characterId = '';
    this.dateLastPlayed = new Date(0);
    this.minutesPlayedTotal = -1;
    this.light = -1;
    this.emblemPath = 'https://destinyemblemcollector.b-cdn.net/destiny1/5820d41ea5dcce690e44dc325841b151.jpg';
    this.emblemBackgroundPath = 'https://destinyemblemcollector.b-cdn.net/destiny1/5820d41ea5dcce690e44dc325841b151.jpg';
    this.classHash = '';
    this.className = 'unknown';
  }
  
}



/**
 * Description of Destiny 2 clan
 */
export class DestinyClanDescriptor {
  groupId : string;
  name : string;
  clanCallsign : string;
  
  constructor() {
    this.name = 'unknown';
    this.groupId = '-1';
    this.clanCallsign = '_';
  }
}


