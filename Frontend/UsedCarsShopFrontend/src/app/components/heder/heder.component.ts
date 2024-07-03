import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarBrandsModelsService } from 'src/app/services/car-brands-models.service';
import { MessagesService } from 'src/app/services/messages.service';
import { WebsocketMessagesService } from 'src/app/services/websocket-messages.service';

@Component({
  selector: 'app-heder',
  templateUrl: './heder.component.html',
  styleUrls: ['./heder.component.scss']
})
export class HederComponent implements OnInit{
  public selectedBrand = '';
  public selectedModel = '';
  public username:any
  public dashboard = true
  public adverForm = false
  public adver = false
  public options = false
  public _messageService:MessagesService
  public numberMessages:any
  _carBrandsWithModels:CarBrandsModelsService | undefined;
  carBrandsWithModels:any
  carModels: string[] = [];
  brands = false;
  models = false;
  constructor(private router:Router, private wsService:WebsocketMessagesService, private messageService:MessagesService, private brandsWithModelsService:CarBrandsModelsService){
      this._messageService = messageService;
      this._carBrandsWithModels = brandsWithModelsService;
  }
  ngOnInit():void{
    this.username = localStorage.getItem("Username")
    this.loadOptions();
  }
  showOptions(){
    this.brands = !this.brands
    if(this.models) this.models = false
  }
  loadOptions(){
    this.carBrandsWithModels = this._carBrandsWithModels?.getBrandsAndModles();
  }
 
  loadModels(){
   
   const brand = this.carBrandsWithModels.find((item:any) => item.brand === this.selectedBrand)
 
   this.carModels = brand ? brand.models : []
   this.models = true;
   
  }
  navigateToFav() {
    this.router.navigate(['/Favorites'])
  }
  navigateToHome() {  
    this.router.navigate(['/Dashboard'])
  }
  navigateToAdvertisement(card:any){
    this.router.navigate(['/Advertisement']);
  }

  navigateToMessages(){
    this.router.navigate(['/Messages/Inbox']);
  }


  sendMessage(){
    this.router.navigate(['/NewMessage'])
  }
 
  changeToForm(){
    this.router.navigate(['/New Adver'])
  }
  ngDoCheck():void{
    this.numberMessages = this._messageService.getNumberMessages()
  }
  showDropdown(){
    this.options = true
  }

  closeDropdown(){
    this.options = false
  }

  logout(){
    this.wsService.close();
    this.router.navigate(["/Login"]);
    localStorage.removeItem("Username");
    localStorage.removeItem("Token");
    localStorage.removeItem("userID")
    localStorage.removeItem("adverID")
  }

 
}
