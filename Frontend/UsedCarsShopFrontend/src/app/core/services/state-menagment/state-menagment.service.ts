import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateMenagmentService {

  private HttpErrorSubject = new BehaviorSubject<string | null>(null)
  private HttpIsErrorSubject = new BehaviorSubject<boolean | null>(false)

  httpError$ = this.HttpErrorSubject.asObservable()
  httpIsError$ = this.HttpIsErrorSubject.asObservable()

  private isSessionExpiredSubject = new BehaviorSubject<boolean | null>(false)
  
  isSessionExpired$ = this.isSessionExpiredSubject.asObservable();

  setIsExpired(isExpired:boolean | null){
    this.isSessionExpiredSubject.next(isExpired)
  }
  setError(error:string){
    this.HttpErrorSubject.next(error)
  }
  setIsError(isError:boolean){
    this.HttpIsErrorSubject.next(isError)
  }
}
