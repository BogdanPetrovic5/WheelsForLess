import { Component, Type } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-adver-form',
  templateUrl: './new-adver-form.component.html',
  styleUrls: ['./new-adver-form.component.scss']
})
export class NewAdverFormComponent {

  AdverName = "";
  Brand= "";
  Model= "";
  Year= "";
  BodyType= "";
  FuelType= "";
  Price = "";
  UserID:any
  token:any
  UserName:any
  selectedFiles: File[] = [];
  constructor(private router:Router, private dashboard: DashboardService){

  }

  

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        
        this.selectedFiles.push(files[i]); 
        
      }
    }
    console.log(this.selectedFiles)
  }

  convertToMB(){
    
  }
  placeAdver(){
    this.UserName = localStorage.getItem("Username");
 
    const formData = new FormData();
    formData.append("AdverName", this.AdverName);
    formData.append("UserName", this.UserName);
    formData.append("Brand", this.Brand);
    formData.append("Model", this.Model);
    formData.append("Year", this.Year);
    formData.append("Type", this.BodyType);
    formData.append("FuelType", this.FuelType);

    for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append("selectedImages", this.selectedFiles[i]);
    }
    this.token = localStorage.getItem("Token");
    console.log(this.token)
    this.dashboard.placeAdvertisement(this.token, formData).subscribe(response =>{
      console.log("Top")
    }, (error:HttpErrorResponse) =>{
      console.log("Jok")
    })
  }
}
