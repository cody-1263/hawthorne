



export class BungieNetProvider {
  
  
  
  
  
  
  
  
  
  
  
  
  
  /**
   * Send GET to bungie.net
   * @param endpoint 
   * @returns 
   */
  async bungieGet(endpoint : string) {
    let xak = this.getSomeWeirdText();
    let bungoParam = { headers: {  'X-API-Key': xak} };
    let apiRootPath = 'https://www.bungie.net/Platform';
    let url = apiRootPath + endpoint;
    let fetchResponse = await fetch(url, bungoParam);
    let reportJson = await fetchResponse.json();
    return reportJson;
  }
  
  /**
   * Send POST to bungie.net
   * @param endpoint 
   * @param data 
   */
  async bungiePost(endpoint : string, data : any) {
    let xak = this.getSomeWeirdText();
    let parameters = { 
      headers: {  'X-API-Key': xak}, 
      method: 'POST',
      body: JSON.stringify(data),
    };
    let apiRootPath = 'https://www.bungie.net/Platform';
    let url = apiRootPath + endpoint;
    let fetchResponse = await fetch(url, parameters);
    let reportJson = await fetchResponse.json();
    return reportJson;
  }
  
  /** gets some weird text */
  getSomeWeirdText() : string {
    return '84e133a91eea4882b9a0bf6f404ef782';
  }
  
}