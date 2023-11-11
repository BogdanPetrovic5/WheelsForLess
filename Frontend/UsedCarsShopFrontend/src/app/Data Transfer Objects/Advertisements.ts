export class Advertisement {
    Advertisements = [
        {
          adverID: 0, // Initialize with appropriate default values
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
          },
          imagePaths:[{
            imagePath:'',
            AdverID:0
          }]
        },
      ];
  }
  