import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserSessionMenagmentService } from '../services/user-session-menagment.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private _userService:UserSessionMenagmentService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this._userService.getItem("Token");
    const protectedUrls = [
      `${environment.apiUrl}/api/Messages/SendMessage`,
      `${environment.apiUrl}/api/Advertisement/MarkAsFavorite`
    ]
    if(token && protectedUrls.includes(request.url)){
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request);
  }
}
