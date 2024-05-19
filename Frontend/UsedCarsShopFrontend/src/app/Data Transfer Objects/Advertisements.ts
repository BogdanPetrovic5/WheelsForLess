export class Advertisement {
    Advertisements = [
        {
          adverID: 0,
          userID: 0,
          adverName: '',
          carID: 0,
          price: 0,
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
            miliage:''
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
  