
import DestinyUserDescriptor from './DestinyUserDescriptor.js';


export default class UserDataProvider {
  
  
  
  /**
   * Get test array of users
   * @returns {DestinyUserDescriptor[]} array of users
   */
  GetUsersTest() {
    
    let arr = [];
    
    arr.push(new DestinyUserDescriptor());
    arr[0].destinyName = 'cody#1263';
    arr[0].profileName = 'cody';
    arr[0].profileIconUrl = 'https://www.bungie.net/common/destiny2_content/icons/e958575e8bee5764e2f00ce34e121424.jpg';
    arr.push(new DestinyUserDescriptor());
    arr[1].destinyName = 'Knewklear#1263';
    arr[1].profileName = 'Knewklear';
    arr.push(new DestinyUserDescriptor());
    arr[2].destinyName = 'muggs#1393';
    arr[2].profileName = 'muggs';
    
    return arr;
  }
  
  
  
}