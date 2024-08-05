import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserSessionMenagmentService {

  constructor() { }
  clearSession(){
    sessionStorage.clear()
  }
  removeItemFromSessionStorage(item:string){
    sessionStorage.removeItem(item);
  }
  setWebsocketUrl(wsUrl:string){
    sessionStorage.setItem("wsUrl", wsUrl);
  }
  setUserID(userID:number | null){
    sessionStorage.setItem("userID", JSON.stringify(userID))
  }
  setIsUserAllowedToSeeMessage(isAllowed:string){
      sessionStorage.setItem("check", isAllowed);
  }
  setReceiver(receiver:string){
    sessionStorage.setItem("receiverUsername", receiver)
  }
  setAdverID(adverID:number){
    sessionStorage.setItem("adverID", JSON.stringify(adverID))
  }
  setMessageID(messageID:number){
    sessionStorage.setItem("messageID",JSON.stringify(messageID));
  }
  setInitialSenderID(initialSenderID:number){
   sessionStorage.setItem("initialSenderID", JSON.stringify(initialSenderID));
  }
  setIsSelected(isSelected:boolean){
    sessionStorage.setItem("isSelected", JSON.stringify(isSelected));
  }
  setCurrentRoute(currentRoute:string){
    sessionStorage.setItem("currentRoute", currentRoute);
  }
  getCurrentRoute():string |null{
    let currentRoute = sessionStorage.getItem("currentRoute");
    return currentRoute ? currentRoute.toString() : null
  }
  getIsUserAllowedToSeeMessage():boolean | null{
    let isAllowed = sessionStorage.getItem("check")
    return isAllowed ? JSON.parse(isAllowed) : null
  }
  getIsSelected():string | null{
    let isSelected = sessionStorage.getItem("isSelected");
    return isSelected;
  }
  getInitialSenderID():number | null{
    let senderID = sessionStorage.getItem("initialSenderID");
    return senderID ? parseInt(senderID, 10) : null
  }
  getAdverID():number | null{
    let adverID = sessionStorage.getItem("adverID");
    return adverID ? parseInt(adverID, 10) : null
  }
  getReceiver():string | null{
    let receiver = sessionStorage.getItem("receiverUsername");
    return receiver ? receiver : null
  }
  getToken():string | null{
    let token = sessionStorage.getItem("Token")
    return token ? token : null
  }
  getUsername():string | null{
    let username = sessionStorage.getItem("Username");
    return username ? username : null;
  }
  getUserID():number | null{
    let userID = sessionStorage.getItem("userID");
    return userID ? parseInt(userID, 10) : null
  }
  getMessageID():number | null{
    let messageID = sessionStorage.getItem("messageID");
    return messageID ? parseInt(messageID, 10) : null
  }
}
