import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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
  public messageID:any;
  
  // public unreadMessages:any = 0;

  private unreadMessagesSubject = new BehaviorSubject<any | null>(null)
  unreadMessages$ = this.unreadMessagesSubject.asObservable();

  private unreadMessagesStepSubject = new BehaviorSubject<any | null>(null);
  unreadMessagesStep$ = this.unreadMessagesStepSubject.asObservable()

  public unreadMessages:number = 0
  constructor(private http:HttpClient) {
  }
  // updateUsers(username:any, step:number):Observable<any>{
  //   return this.http.put<any>(`${environment.apiUrl}/api/User/UpdateNewMessages`,{
  //     username:username,
  //     step:step
  //   });
  // }
  openMessage(messageID:any, username:any, newMessages:any):Observable<any>{
    console.log("Service, MessageID: ", messageID)
    console.log("Service, username: ", username);

    const url = `${environment.apiUrl}/api/Messages/OpenMessage`;
    return this.http.put<any>(url,{
      MessageID:messageID,
      UserName:username,
      UnreadMessages:newMessages
    })
  }
  getUserMessages(cuurentUsername?:any):Observable<any>{
      const url = `${environment.apiUrl}/api/Messages/GetMessages/${cuurentUsername}`;
      console.log(`Fetching messages from URL: ${url}`);
      return this.http.get<any>(url);
  
  }
  getUserToUserMessages(currentUserID?:any,initialSenderID?:any ,adverID?:any){
      adverID = sessionStorage.getItem("adverID");
      currentUserID = sessionStorage.getItem("userID");

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
    
    sessionStorage.setItem("newMessages", JSON.stringify(this.messages))
  }
  incrementMessages(){
    this.messages += 1;
    sessionStorage.setItem("newMessages", JSON.stringify(this.messages));
  }
  
  incrementUnreadMessages(step:any | null){
    this.unreadMessagesSubject.next(step);
  }
  decrementUnreadMessages(step:any | null){
    this.unreadMessagesStepSubject.next(step);
  }
  setChat(chat:any){
    sessionStorage.setItem(this.storageKey, JSON.stringify(chat))
  }
  getChat(){
    const currentChat = sessionStorage.getItem(this.storageKey)
    return currentChat ? JSON.parse(currentChat) : null
  }
 
}
