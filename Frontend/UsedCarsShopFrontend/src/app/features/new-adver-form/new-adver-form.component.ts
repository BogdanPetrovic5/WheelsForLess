import { Component, Type } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CarDetails } from 'src/app/core/services/data-specific/car-details.service';
import { Form, FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserSessionMenagmentService } from 'src/app/core/services/session/user-session-menagment.service';
@Component({
  selector: 'app-new-adver-form',
  templateUrl: './new-adver-form.component.html',
  styleUrls: ['./new-adver-form.component.scss']
})
export class NewAdverFormComponent {
 
  Brand:string = "";
  Model:string = "";
 
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

  brands:boolean = false;
  models:boolean = false;
  body:boolean = false;
  fuel:boolean = false;
  propulsion:boolean = false;
  empty:boolean = false;
  published:boolean = false;
  unpublished:boolean = false;
  isDisabled:boolean = false;
  adverForm: FormGroup;
  constructor(
    private router:Router, 
    private _dashboard: DashboardService,
    private carDetailsService:CarDetails,
    private _formBuilder: FormBuilder,
    private _userService:UserSessionMenagmentService
  ){
    this._carBrandsWithModels = carDetailsService;
    this._bodyTypes = carDetailsService;
    this._fuelTypes = carDetailsService;
    this._propulsionTypes = carDetailsService;

    this.adverForm = this._formBuilder.group({
      AdverName: "",
      UserName: "",
      Brand: [{value:'', disabled: true }],
      Model: [{value:'', disabled: true }],
      Year: "",
      Type: [{value:'', disabled: true }],
      FuelType: [{value:'', disabled: true }],
      Price: "",
      Propulsion: [{value:'', disabled: true }],
      EngineVolume: "",
      HorsePower: "",
      Mileage: ""
    });
  }
  ngOnInit():void{
    sessionStorage.setItem("currentRoute", "New adver");
    this.loadOptions();
  }

  toggleDropdown(type: 'brands' | 'models' | 'body' | 'fuel' | 'propulsion') {
    this[type] = !this[type];
  }
  selectBrand(brand: any) {
    this.adverForm.patchValue({ Brand: brand });
    this.Brand = brand;
    this.loadModels();
    this.brands = false;
  }

  selectModel(model: any) {
    this.adverForm.patchValue({ Model: model });
    this.models = false;
    this.Model = model;
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
   this.selectedFiles = [];
  }
  appendToForm(formData: FormData) {
    for(const key of Object.keys(this.adverForm.controls)){
      const control = this.adverForm.controls[key];
      if(control instanceof FormControl){
        formData.append(key, control.value);
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
    this.appendToForm(formData);
   
    let check = this.isEmpty(formData)
    for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append("selectedImages", this.selectedFiles[i]);
    }
   
    this.token = this._userService.getItem("Token");
    if(!check){
      this._dashboard.placeAdvertisement(this.token, formData).subscribe(response =>{
        this.emptyFields();
        this.showNotification('published');
      }, (error:HttpErrorResponse) =>{
        console.log(error);
      })
    }else{
      this.showNotification('empty');
    }
    
  }
}



