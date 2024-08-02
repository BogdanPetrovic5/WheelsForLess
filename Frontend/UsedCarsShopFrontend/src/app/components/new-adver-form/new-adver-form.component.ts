import { Component, Type } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CarDetails } from 'src/app/services/car-details.service';
import { Form, FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-new-adver-form',
  templateUrl: './new-adver-form.component.html',
  styleUrls: ['./new-adver-form.component.scss']
})
export class NewAdverFormComponent {
  AdverName:string = "";
  Brand:string = "";
  Model:string = "";
  Year:string = "";
  BodyType:string = "";
  FuelType:string = "";
  Price:string = "";
  HorsePower:string ="";
  EngineVolume:string ="";
  Propulsion:string = "";
  Mileage:string = "";
  
  UserID:any
  token:any
  UserName:any
  selectedFiles: File[] = [];
  carModels:any

  _carBrandsWithModels:CarDetails | undefined;
  carBrandsWithModels:any;
  _bodyTypes:CarDetails | undefined;
  bodyTypes:any;
  _fuelTypes:CarDetails | undefined
  fuelTypes:any
  _propulsionTypes:CarDetails | undefined
  propulsionTypes:any

  brands:boolean = false
  models:boolean = false
  body:boolean = false
  fuel:boolean = false
  propulsion:boolean = false
  empty:boolean = false;
  published:boolean = false;
  unpublished:boolean = false;
  
  adverForm: FormGroup;
  constructor(
    private router:Router, 
    private dashboard: DashboardService,
    private carDetailsService:CarDetails,
    private formBuilder: FormBuilder
  ){
    this._carBrandsWithModels = carDetailsService;
    this._bodyTypes = carDetailsService;
    this._fuelTypes = carDetailsService;
    this._propulsionTypes = carDetailsService;

    this.adverForm = this.formBuilder.group({
      AdverName: "",
      UserName: "",
      Brand: "",
      Model: "",
      Year: "",
      Type: "",
      FuelType: "",
      Price: "",
      Propulsion: "",
      EngineVolume: "",
      HorsePower: "",
      Mileage: ""
    });
  }
  ngOnInit():void{
    sessionStorage.setItem("currentRoute", "New adver")
    this.loadOptions()
  }

  openOptionsBrands() {
    this.toggleDropdown('brands');
  }
  
  openOptionsModels() {
    this.toggleDropdown('models');
  }
  
  openBodyTypes() {
    this.toggleDropdown('body');
  }
  
  openFuelTypes() {
    this.toggleDropdown('fuel');
  }
  
  openPropulsionTypes() {
    this.toggleDropdown('propulsion');
  }


  toggleDropdown(type: 'brands' | 'models' | 'body' | 'fuel' | 'propulsion') {
    this[type] = !this[type];
  }
  selectBrand(brand: any) {
    this.adverForm.patchValue({ Brand: brand });
    this.Brand = brand
    this.loadModels();
    this.brands = false;
  }

  selectModel(model: any) {
    this.adverForm.patchValue({ Model: model });
    this.models = false;
    this.Model = model
  }

  selectBodyType(type: any) {
    this.adverForm.patchValue({ Type: type });
    this.body = false;
  }

  selectFuelType(type: any) {
    this.adverForm.patchValue({ FuelType: type });
    this.fuel = false;
  }

  selectPropulsionType(type: any) {
    this.adverForm.patchValue({ Propulsion: type });
    this.propulsion = false;
  }
  loadModels(){
    const brand = this.carBrandsWithModels.find((item:any) => item.brand === this.Brand);
    this.carModels = brand ? brand.models : [];
    console.log(this.carModels)

  }
  loadOptions(){
    this.carBrandsWithModels = this._carBrandsWithModels?.getBrandsAndModles();
    this.bodyTypes = this._bodyTypes?.getBodyTypes();
    this.fuelTypes = this._fuelTypes?.getFuelTypes();
    this.propulsionTypes = this._propulsionTypes?.getPropulsionTypes();
  }
  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]); 
      }
    }
  
  }

  convertToMB(){
    
  }
  isEmpty(formData:any){
    for (let pair of formData.entries()) {
      if (!pair[1]) { 
        return true;
      }
    }
    return false;
  }

  emptyFields(){
   this.adverForm.reset()
   this.selectedFiles = []
  }
  appendToForm(formData: FormData) {
    for(const key of Object.keys(this.adverForm.controls)){
      const control = this.adverForm.controls[key];
      if(control instanceof FormControl){
        formData.append(key, control.value)
      }
    }
  }

  showNotification(type: 'published' | 'empty') {
    this[type] = true;
    setTimeout(() => {
      this[type] = false;
    }, type === 'published' ? 1000 : 2000);
  }
  placeAdver(){
    console.log(this.adverForm)
    this.adverForm.patchValue({ UserName: sessionStorage.getItem("Username") });
    var formData = new FormData();
    this.appendToForm(formData)
   
    let check = this.isEmpty(formData)
    for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append("selectedImages", this.selectedFiles[i]);
    }
   
    this.token = sessionStorage.getItem("Token");
    if(!check){
      this.dashboard.placeAdvertisement(this.token, formData).subscribe(response =>{
        this.emptyFields()
        this.showNotification('published');
      }, (error:HttpErrorResponse) =>{
        console.log(error);
      })
    }else{
      this.showNotification('empty');
    }
    
  }
}



// import { Component, Type } from '@angular/core';
// import { Router } from '@angular/router';
// import { DashboardService } from 'src/app/services/dashboard.service';
// import { HttpErrorResponse } from '@angular/common/http';
// import { CarDetails } from 'src/app/services/car-details.service';
// import { Form } from '@angular/forms';

// @Component({
//   selector: 'app-new-adver-form',
//   templateUrl: './new-adver-form.component.html',
//   styleUrls: ['./new-adver-form.component.scss']
// })
// export class NewAdverFormComponent {
//   AdverName = "";
//   Brand = "";
//   Model = "";
//   Year = "";
//   BodyType = "";
//   FuelType = "";
//   Price = "";
//   HorsePower ="";
//   EngineVolume ="";
//   Propulsion = "";
//   Mileage = "";
  
//   UserID:any
//   token:any
//   UserName:any
//   selectedFiles: File[] = [];
//   carModels:any

//   _carBrandsWithModels:CarDetails | undefined;
//   carBrandsWithModels:any;
//   _bodyTypes:CarDetails | undefined;
//   bodyTypes:any;
//   _fuelTypes:CarDetails | undefined
//   fuelTypes:any
//   _propulsionTypes:CarDetails | undefined
//   propulsionTypes:any

//   brands:boolean = false
//   models:boolean = false
//   body:boolean = false
//   fuel:boolean = false
//   propulsion:boolean = false
//   empty:boolean = false;
//   published:boolean = false;
//   constructor(
//     private router:Router, 
//     private dashboard: DashboardService,
//     private carDetailsService:CarDetails
//   ){
//     this._carBrandsWithModels = carDetailsService;
//     this._bodyTypes = carDetailsService;
//     this._fuelTypes = carDetailsService;
//     this._propulsionTypes = carDetailsService;
//   }
//   ngOnInit():void{
//     sessionStorage.setItem("currentRoute", "New adver")
//     this.loadOptions()
//   }

//   openOptionsBrands(){
//     this.brands = !this.brands
//   }
//   openOptionsModels(){
//     this.models = !this.models
//   }
//   openBodyTypes(){
//     this.body = !this.body
//   }
//   openFuelTypes(){
//     this.fuel = !this.fuel
//   }
//   openPropulsionTypes(){
//     this.propulsion = !this.propulsion
//   }

//   selectBrand(brand:any){
//     this.Brand = brand
//     this.loadModels()
//     console.log(this.Brand);
//     this.brands = false
//   }
//   selectModel(model:any){
//     this.Model = model;
//     this.models = false
//   }
//   selectBodyType(type:any){
//     this.BodyType = type;
//   }
//   selectFuelType(type:any){
//     this.FuelType = type
//   }
//   selectPropulsionType(type:any){
//     this.Propulsion = type;
//   }
  
//   loadModels(){
//     const brand = this.carBrandsWithModels.find((item:any) => item.brand === this.Brand);
//     this.carModels = brand ? brand.models : [];
//     console.log(this.carModels)

//   }
//   loadOptions(){
//     this.carBrandsWithModels = this._carBrandsWithModels?.getBrandsAndModles();
//     this.bodyTypes = this._bodyTypes?.getBodyTypes();
//     this.fuelTypes = this._fuelTypes?.getFuelTypes();
//     this.propulsionTypes = this._propulsionTypes?.getPropulsionTypes();
//   }
//   onFileSelected(event: Event): void {
//     const inputElement = event.target as HTMLInputElement;
//     const files = inputElement.files;

//     if (files && files.length > 0) {
//       for (let i = 0; i < files.length; i++) {
//         this.selectedFiles.push(files[i]); 
//       }
//     }
//     console.log(this.selectedFiles)
//   }

//   convertToMB(){
    
//   }
//   isEmpty(formData:any){
//     for (let pair of formData.entries()) {
//       if (!pair[1]) { 
//         return true;
//       }
//     }
//     return false;
//   }
//   emptyFields(){
//     this.AdverName = "";
//     this.Brand= "";
//     this.Model= "";
//     this.Year = "";
//     this.BodyType = "";
//     this.FuelType = "";
//     this.Price = "";
//     this.HorsePower ="";
//     this.EngineVolume ="";
//     this.Propulsion = "";
//     this.Mileage = "";
//     this.selectedFiles = []
//   }
//   appendToForm(formData:FormData){
//     formData.append("AdverName", this.AdverName);
//     formData.append("UserName", this.UserName);
//     formData.append("Brand", this.Brand);
//     formData.append("Model", this.Model);
//     formData.append("Year", this.Year);
//     formData.append("Type", this.BodyType);
//     formData.append("FuelType", this.FuelType);
//     formData.append("Price", this.Price);
//     formData.append("Propulsion", this.Propulsion)
//     formData.append("EngineVolume", this.EngineVolume);
//     formData.append("HorsePower", this.HorsePower);
//     formData.append("Mileage", this.Mileage)
//   }
//   showPublishedNotification(){
//     this.published = true;
//     setTimeout(()=>{
//       this.published = false
//     }, 1000)
//   }
//   showUnpublishedNotification(){
//     this.empty = true;
//     setTimeout(()=>{
//        this.empty = false
//      }, 2000)
//   }
//   placeAdver(){
//     this.UserName = sessionStorage.getItem("Username");
//     const formData = new FormData();
//     this.appendToForm(formData)
//     let check = this.isEmpty(formData)
//     for (let i = 0; i < this.selectedFiles.length; i++) {
//         formData.append("selectedImages", this.selectedFiles[i]);
//     }
//     for (let pair of (formData as any).entries()) {
//       console.log(`${pair[0]}: ${pair[1]}`);
//     }
//     this.token = sessionStorage.getItem("Token");
//     if(!check){
//       this.dashboard.placeAdvertisement(this.token, formData).subscribe(response =>{
//         this.emptyFields()
//         this.showPublishedNotification();
//       }, (error:HttpErrorResponse) =>{
//         console.log(error);
//       })
//     }else{
//       this.showUnpublishedNotification()
//     }
    
//   }
// }