import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent {
  /**
   *
   */
  public RegisterFirstName = ""
  public RegisterLastName = ""
  public RegisterUserName = ""
  public RegisterPhoneNumber = ""
  public RegisterPassword = ""
  constructor(private auth:AuthenticationService) {
    
    
  }
  register(){
    const user = {
      FirstName:this.RegisterFirstName,
      LastName:this.RegisterLastName,
      UserName:this.RegisterUserName,
      PhoneNumber:this.RegisterPhoneNumber,
      Password:this.RegisterPassword
    }
    this.auth.register(this.RegisterFirstName,this.RegisterLastName, this.RegisterUserName,this.RegisterPhoneNumber,this.RegisterPassword).subscribe((repsonse) =>{
      if (repsonse && repsonse.error) {
        console.log('Server returned an error:', repsonse.error);
      } else {
        console.log('Success');
      }
    },(error:HttpErrorResponse) =>{
      console.error('HTTP error occurred:', error);
    });
  }
}
