

/** General Destiny 2 accout information, including list of characters */
export class DestinyUserProfile {
  
  /** Main ID of a user  */
  bungieNetMembershipId = '0';
  
  bungieGlobalDisplayName = 'unknown#7777';
  displayName = 'UNKNOWN';
  nameCode = '7777';
  iconPath = 'https://www.bungie.net/common/destiny2_content/icons/74936f0e7fab1216a85e63fbaa83045a.jpg';
  
  characterDescriptors = new Array<DestinyCharacterProfile>();
  clanDescriptor = createEmptyClan();
  
}




/** Basic Destiny 2 character description */
export class DestinyCharacterProfile {
  
  destinyMembershipId = '0';
  membershipType = '0';
  characterId = '0';
  
  dateLastPlayed = new Date(0);
  minutesPlayedTotal = 0;
  
  light  = 0;
  
  emblemPath  = 'https://www.bungie.net/common/destiny2_content/icons/74936f0e7fab1216a85e63fbaa83045a.jpg';
  emblemBackgroundPath = 'https://www.bungie.net/common/destiny2_content/icons/0e3ebc95c44ff4a62701aa22edac0736.jpg';
  
  classHash = '0';
  className = 'unknown';
  
}




/** Basic Destiny 2 clan description */
export class DestinyClanProfile {
  
  groupId = '0';
  name = 'unknown clan';
  clanCallsign = 'ukc';
  
}




function createEmptyClan() : DestinyClanProfile {
  let c = new DestinyClanProfile();
  c.name = '';
  c.clanCallsign = '';
  return c;
}