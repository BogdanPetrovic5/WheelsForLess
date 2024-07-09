export class Messages{
    Messages = [
        {
            chatID:0,
            senderUsername:'',
            receiverUsername:'',
            adverID:0,
            message:'',
            dateSent:new Date(),
            isSelected:false,
            messageID:0,
            isNew: Boolean,
            initialSenderID:0,
            advertisement:{
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
                favoritedByUserDto:[{
                  UserID:0,
                  AdverID:0
                }]
            }
        }
    ]
}