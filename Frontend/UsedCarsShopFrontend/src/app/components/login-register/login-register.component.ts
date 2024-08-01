import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent {

ngOnInit():void{
  sessionStorage.removeItem("isSelected")
}

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
  public RegisterFirstName:string = "";
  public RegisterLastName:string = "";
  public RegisterUserName:string = "";
  public RegisterPhoneNumber:string = "";
  public RegisterPassword:string = "";
  public LoginPassword:string= "";
  public LoginUserName:string = "";
  
  public registerForm:boolean = false;
  public loginForm:boolean = true;
  constructor(
    private auth:AuthenticationService, 
    private router:Router, 
    private loadingService:LoadingService
  ) {}
  navigateToDashboard(){
    this.router.navigate(['/Dashboard'])
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
      
      
      this.router.navigate(["/Dashboard"])
    }, (error:HttpErrorResponse) =>{
      console.log(error);
    })
  }
  
}
