import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-heder',
  templateUrl: './heder.component.html',
  styleUrls: ['./heder.component.scss']
})
export class HederComponent {
navigateToFav() {
  this.router.navigate(['/Favorites'])
}
  navigateToHome() {  
    this.router.navigate(['/Dashboard'])
  }
  
  public username:any
  public dashboard = true
  public adverForm = false
  public adver = false
  public options = false
  constructor(private router:Router){
    
  }
  sendMessage(){
    
    this.router.navigate(['/NewMessage'])
  }
  ngOnInit(){
      this.username = localStorage.getItem("Username")
      
  }
  changeToForm(){
    this.router.navigate(['/New Adver'])
  }

  showDropdown(){
    this.options = true
  }
  closeDropdown(){
    this.options = false
  }
  logout(){
    this.router.navigate(["/Login"]);
    localStorage.removeItem("Username");
    localStorage.removeItem("Token");
    localStorage.removeItem("userID")
    localStorage.removeItem("adverID")
  }

  navigateToAdvertisement(card:any){
      this.router.navigate(['/Advertisement']);
  }

  
}
