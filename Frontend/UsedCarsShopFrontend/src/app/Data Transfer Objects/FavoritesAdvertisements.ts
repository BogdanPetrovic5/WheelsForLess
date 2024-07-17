export class FavoiriteAdvertisement{
    Advertisements = [
        {
          adverID: 0,
          userID: 0,
          adverName: '',
          carID: 0,
          price: 0,
          date:new Date(),
          
          userDto: {
            userID: 0,
            firstName: '',
            lastName: '',
            userName: '',
            phoneNumber: '',
          },
          carDto: {
            carID: 0,
            model: '',
            brand: '',
            year: '',
            type: '',
            fuelType: '',
            propulsion:'',
            engineVolume:'',
            horsePower:'',
            mileage:''
          },
          imagePaths:[{
            imagePath:'',
            AdverID:0
          }],
          FavoritedByUserDto:[{
            UserID:0,
            AdverID:0
          }]
        },
      ];
}