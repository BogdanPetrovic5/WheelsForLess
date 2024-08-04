import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { DashboardService } from 'src/app/services/dashboard.service';
@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent {



  public RegisterFirstName:string = "";
  public RegisterLastName:string = "";
  public RegisterUserName:string = "";
  public RegisterPhoneNumber:string = "";
  public RegisterPassword:string = "";

  public LoginPassword:string= "";
  public LoginUserName:string = "";
  
  public registerForm:boolean = true;
  public loginForm:boolean = false;
  public warning:boolean = false;
  public alert:boolean = false;
  public warning_1: boolean = false;

  public errorMessage = ""
  constructor(
    private auth:AuthenticationService, 
    private router:Router, 
    private loadingService:LoadingService,
    private dashService:DashboardService
  ) {}
  ngOnInit():void{
    this.dashService.filterBrand = null
    this.dashService.filterModel = null
    sessionStorage.clear()
  }

  navigation(route:any){
    this.router.navigate([`/${route}`])
  }
  emptyFields(){
    this.RegisterFirstName = ""
    this.RegisterLastName = ""
    this.RegisterUserName = ""
    this.RegisterPhoneNumber = ""
    this.RegisterPassword = ""
  }
  hasEmptyProperties(obj:any):boolean{
    for (let key in obj) {
      if (obj[key] === "" || obj[key] === null || obj[key] === undefined) {
        return true;
      }
    }
    return false;
  }
  register(){
    const user = {
      FirstName:this.RegisterFirstName,
      LastName:this.RegisterLastName,
      UserName:this.RegisterUserName,
      PhoneNumber:this.RegisterPhoneNumber,
      Password:this.RegisterPassword
    }
    if(this.hasEmptyProperties(user)){
      this.warning_1 = true;
      setTimeout(()=>{
        this.warning_1 = false
      }, 1500)
    }else{
      this.auth.register(user).subscribe((repsonse) =>{
        if (repsonse && repsonse.error) {
          console.log('Server returned an error:', repsonse.error);
        } else {
          this.alert = true
          setTimeout(()=>{
            this.alert = false
          }, 1500)
          this.emptyFields()
          this.ChangeFormToLogin()
        }
      },(error:HttpErrorResponse) =>{
          if(error.status == 409){
            
            this.errorMessage = error.error
            this.warning = true
            setTimeout(()=>{
              this.warning = false
            }, 1500)
            
          }
      });
    }
  
  }
  
  Login() {
    const user = {
      UserName:this.LoginUserName,
      Password:this.LoginPassword
    }
    if(this.hasEmptyProperties(user)){
      this.warning_1 = true;
      setTimeout(()=>{
        this.warning_1 = false
      }, 1500)
    }else{
      this.auth.login(user).subscribe((token) =>{
        this.router.navigate(["/Dashboard"])
      }, (error:HttpErrorResponse) =>{
        this.errorMessage = error.error
        this.warning = true
        setTimeout(()=>{
          this.warning = false
        }, 1500)
      })
    }
   
  }

  toggleForm() {
    this.registerForm = !this.registerForm;
    this.loginForm = !this.loginForm;
  }
  ChangeFormToLogin() {
    this.registerForm = false;
    this.loginForm = true;
  }
  ChangeFormToRegister() {
    this.registerForm = true;
    this.loginForm = false;
  }
}
