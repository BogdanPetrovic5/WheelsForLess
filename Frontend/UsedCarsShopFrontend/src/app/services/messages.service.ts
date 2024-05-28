import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private http:HttpClient) { }
  getUserToUserMessages(username?:any, adverID?:any){
      adverID = localStorage.getItem("adverID");
      username = localStorage.getItem("username")
      return this.http.get<any>(`${environment.apiUrl}/api/Messages/GetMessages?username=${username}&adverID=${adverID}`)
  }
  sendMessage(senderUsername?:any, receiverUsername?:any, adverID?:any, message?:any):Observable<any>{
   
    return this.http.post<any>(`${environment.apiUrl}/api/Messages/SendMessage`,{
      Message:message,
      SenderUsername:senderUsername,
      ReceiverUsername:receiverUsername,
      AdverID:adverID
    })
  }
}
