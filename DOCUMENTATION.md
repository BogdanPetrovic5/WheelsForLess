# **UsedCarsShop**
A web application for posting advertisements and selling used/second hand cars.
This app was made during my learning of ASP.NET and SSMS. App was made with Angular framework and ASP.NET as backend. DB was SSMS.
#
# Features
- Creating new account
- Loggin in
- Viewing all advertisements
- Posting new advertisements
- Creating wishlist
- Notifications
# Components
- Login/Register page
  - Form for registering new users
     - Username
     - Password
     - Firstname
     - Lastname
  - Form for loggin in
    - Username
    - Passsword
- Header
  - Notifications
  - Wishlist
  - New Adver Button
- Dashboard
  - Filter Search
  - Previewing Advers
  - Ability to click on any adver and look at it individually
- New Adver
  - Form Content:
    - Adver's name
    - Car's Brand
    - Car's Model
    - Car's Year
    - Car's fule type
    - Car's Price
    - Fixed or not fixed price
# Backend
REST API listed down below
## Login
`POST Advertisements/Login`
### Request body:
``` 
{
  "UserName":"example",
  "Password":"topSecretExample"
}
```
## Register
### Request body
`POST Advertisements/Register`
``` 
{
   "FirstName":"example",
   "LastName":"example",
   "UserName":"example",
   "PhoneNumber":"example",
   "Password":"example",
}
```
## Publish adver
### Request Header
`Authorization: Bearer <JWT_TOKEN>`
### Request body
`POST Advertisements/PublishAdvertisement`
``` 
{
  "AdverName":"example",
  "UserName":"example",
  "Brand":"example",
  "Model":"example",
  "Year":"example",
  "Type":"example",
  "FuelType":"example",
  "Price":0,
  "Propulsion":"example",
  "EngineVolume":"example",
  "HorsePower":"example",
  "Mileage":"example",
  "selectedImages":[
      
  ]
}
```
## Get all advertisements
### Request
`GET Advertisements/GetAdvertisements`
### Request body
`none`

### Response body
```
[
  {
    "CarID":0,
    "UserID":0,
    "AdverID":0,
    "AdverName":"example",
    "Price":0,
    "UserDto":{
      "UserID" : 0,
      "FirstName" : "example",
      "LastName" : "example",
      "UserName" : "example",
      "PhoneNumber" : "example",
    },
    "CarDto":{
      "Brand" : "example",
      "Model" : "example",
      "Type" : "example",
      "FuelType" : "example",
      "Year" : "example",
      "CarID": 0,
      "HorsePower" : "example",
      "EngineVolume" : "example",
    },
    "ImagesPaths" : [],
    "FavoritedByUserDto " : {
        "UserID":0,
        "AdverID": 0
      }
  }
]
```

## Mark as favorite
`POST Advertisement/MarkAsFavorite`
### Request headers
`Authorization: Bearer <JWT_TOKEN>`
### Request Body
```
{
  "UserName":0,
  "AdverID":0
}  
```
## Get all favorites
`GET Advertisements/GetAdvertisements`
### Request Body
`none`
### Response body
```
[
  {
    "CarID":0,
    "UserID":0,
    "AdverID":0,
    "AdverName":"example",
    "Price":0,
    "UserDto":{
      "UserID" = 0,
      "FirstName": "example",
      "LastName" : "example",
      "UserName" : "example",
      "PhoneNumber" : "example",
    },
    "CarDto":{
      "Brand" : "example",
      "Model" : "example",
      "Type" : "example",
      "FuelType" : "example",
      "Year" : "example",
      "CarID" : 0,
      "HorsePower" : "example",
      "EngineVolume" : "example",
    },
    "ImagesPaths" : [],
  }
]
```
## Send Message 
`POST Messages/SendMessage` 
### Request body
```
{
  "Message":"example",
  "SenderUsername":"example",
  "ReceiverUsername:"example,
  "AdverID":0
}
```
### Response Body
`none`

## Get Messages
`GET Messages/GetMessages/{username}/{adverID}` / `GET Messages/GetMessages/{username}`
### Request header
`none` for now
### Request body 
`none`
### Response body
```
[
  {
    "senderID": 11,
    "receiverID": 3,
    "adverID": 19,
    "messageID": 2,
    "message": "string",
    "dateSent": "0001-01-01T00:00:00",
  }
]
```
