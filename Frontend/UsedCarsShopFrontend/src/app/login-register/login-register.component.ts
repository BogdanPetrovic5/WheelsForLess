import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent {


ChangeFormToLogin() {
  this.registerForm = false;
  this.loginForm = true;
}
ChangeFormToRegister() {
  this.registerForm = true;
  this.loginForm = false;
}
  /**
   *
   */
  public RegisterFirstName = "";
  public RegisterLastName = "";
  public RegisterUserName = "";
  public RegisterPhoneNumber = "";
  public RegisterPassword = "";
  public LoginPassword= "";
  public LoginUserName = "";
  
  public registerForm = false;
  public loginForm = true;
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

  Login() {
    this.auth.login(this.LoginUserName, this.LoginPassword).subscribe((response) =>{
      console.log("Uspesno brt");
    }, (error:HttpErrorResponse) =>{
      console.log(error);
    })
  }
}
