import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/core/services/dashboard/loading.service';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserSessionMenagmentService } from 'src/app/core/services/session/user-session-menagment.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent {
  registerForm:FormGroup;
  loginForm:FormGroup;

  public isRegisterForm:boolean = true;
  public isLoginForm:boolean = false;
  public warning:boolean = false;
  public alert:boolean = false;
  public warning_1: boolean = false;

  public errorMessage:string = ""

  constructor(
    private _auth:AuthenticationService, 
    private _router:Router, 
    private _dashService:DashboardService,
    private _formBuilder:FormBuilder,
    private _userService:UserSessionMenagmentService,
    private _cookieService:CookieService
  ) {
    this.registerForm = this._formBuilder.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      UserName: ['', Validators.required],
      PhoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      Password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.loginForm = this._formBuilder.group({
      UserName: ['', Validators.required],
      Password: ['', Validators.required]
    });
  }
  ngOnInit():void{
    this._userService.clearSession()
    this._dashService.filterBrand = null
    this._dashService.filterModel = null
    this._dashService.setSortParameter = null
    this._cookieService.delete("jwtToken")
  }

  navigation(route:any){
    this._router.navigate([`/${route}`])
  }
  emptyFields(){
    this.registerForm.reset()
    this.loginForm.reset()
  }
  hasEmptyControls(formGroup: FormGroup): boolean {
    let hasEmpty = false;
  
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control && (control.value === '' || control.value === null || control.value === undefined)) {
        hasEmpty = true;
      }
    });
  
    return hasEmpty;
  }
  register(){
  
    if(this.hasEmptyControls(this.registerForm)){
      this.warning_1 = true;
      setTimeout(()=>{
        this.warning_1 = false
      }, 1500)
    }else{
      const user = this.registerForm.value
      this._auth.register(user).subscribe((repsonse) =>{
        if (repsonse && repsonse.error) {
          console.log('Server returned an error:', repsonse.error);
        } else {
          this.alert = true
          setTimeout(()=>{
            this.alert = false
          }, 1500)
          this.emptyFields()
          this.toggleForm()
        }
      },(error:HttpErrorResponse) =>{
        console.log(error)    
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
  
  login() {
    if(this.hasEmptyControls(this.loginForm)){
      this.warning_1 = true;
      setTimeout(()=>{
        this.warning_1 = false
      }, 1500)
    }else{
      const user = this.loginForm.value
      this._auth.login(user).subscribe((token) =>{
        this._router.navigate(["/Dashboard"])
      }, (error:HttpErrorResponse) =>{
        console.log(error) 
        this.errorMessage = error.error
        this.warning = true
        setTimeout(()=>{
          this.warning = false
        }, 1500)
      })
    }
  }

  toggleForm() {
    this.isRegisterForm = !this.isRegisterForm;
    this.isLoginForm = !this.isLoginForm;
  }

}
