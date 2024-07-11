import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private storageKey = "selectedChat"
  private newMessageSource = new Subject<any>();
  newMessage$ = this.newMessageSource.asObservable();
  public messages = 0;
  number:any
  constructor(private http:HttpClient) { 
    if(localStorage.getItem("newMessages") != undefined){
      this.number = localStorage.getItem("newMessages");
      this.number = parseInt( this.number, 10);
    }
   
    if(this.number != undefined){
      this.messages = this.number;
    }
    
  }
  openMessage(messageID:any):Observable<any>{
    const url = `${environment.apiUrl}/api/Messages/OpenMessage`;
    return this.http.put<any>(url,{
      MessageID:messageID
    })
  }
  getUserMessages(cuurentUsername?:any):Observable<any>{
      const url = `${environment.apiUrl}/api/Messages/GetMessages/${cuurentUsername}`;
      console.log(`Fetching messages from URL: ${url}`);
      return this.http.get<any>(url);
  
  }
  getUserToUserMessages(currentUserID?:any,initialSenderID?:any ,adverID?:any){
      adverID = localStorage.getItem("adverID");
      currentUserID = localStorage.getItem("userID");

      return this.http.get<any>(`${environment.apiUrl}/api/Messages/GetMessages/${currentUserID}/${initialSenderID}/${adverID}`)
  }
  sendMessage(senderUsername?:any, receiverUsername?:any, adverID?:any, message?:any):Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/api/Messages/SendMessage`,{
      Message:message,
      SenderUsername:senderUsername,
      ReceiverUsername:receiverUsername,
      AdverID:adverID
    })
  }
  decrementMessages(step:any){
    if(this.messages - step >= 0 ){
      this.messages -= step;
    }
    
    localStorage.setItem("newMessages", JSON.stringify(this.messages))
  }
  incrementMessages(){
    this.messages += 1;
    localStorage.setItem("newMessages", JSON.stringify(this.messages));
  }
  getNumberMessages(){
    return this.messages;
  }
  setChat(chat:any){
    sessionStorage.setItem(this.storageKey, JSON.stringify(chat))
  }
  getChat(){
    const currentChat = sessionStorage.getItem(this.storageKey)
    return currentChat ? JSON.parse(currentChat) : null
  }
  announceNewMessage(data: any){
    this.newMessageSource.next(data)
  }
}
