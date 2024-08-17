import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StateMenagmentService } from '../services/state-menagment/state-menagment.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private _stateMenagmentService:StateMenagmentService){}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
       
        if (error.status === 401) {
          let errorMessage = error.error.error
          this.setStates(errorMessage);
          
          console.log(error.error.error)
           
        } else if (error.status === 500) {
          console.error('Server error:', error.error);
          alert('Server error: ' + error.error);
        } else {
          console.error('An unknown error occurred:', error);
        }

        return throwError(error); 
      })
    );
  }
  setStates(errorMessage:string){
    this._stateMenagmentService.setError(errorMessage)
    this._stateMenagmentService.setIsError(true);
    this._stateMenagmentService.setIsExpired(true);
  }
}