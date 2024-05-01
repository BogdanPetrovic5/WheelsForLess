import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
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
  constructor(private auth:AuthenticationService, private router:Router) {
    
    
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
        alert("Registration succeded")
      }
    },(error:HttpErrorResponse) =>{
        if(error.status == 409){
          alert("User already exists")
        }
    });
  }

  Login() {
    this.auth.login(this.LoginUserName, this.LoginPassword).subscribe((token) =>{
      localStorage.setItem("Token", token.value)
      localStorage.setItem("Username", this.LoginUserName)
      this.router.navigate(["/Dashboard"])
    }, (error:HttpErrorResponse) =>{
      console.log(error);
    })
  }
}
