using CarWebShop.Data;
using CarWebShop.Dto;
using CarWebShop.Interfaces;
using CarWebShop.Models;
using CarWebShop.Utilities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Identity.Client;

namespace CarWebShop.Repository
{
    public class MessageRepository : IMessagesRepository
    {
        private readonly DataContext _dataContext;
        private readonly AdverUtility _adverUtility;
        public MessageRepository(DataContext dataContext, AdverUtility adverUtility)
        {
            _dataContext = dataContext;
            _adverUtility = adverUtility;
        }
        public ICollection<Messages> GetMessages(int userID)
        {
            return _dataContext.Messages.Select(a => new Messages
            {
                AdverID = a.AdverID,
                SenderID = a.SenderID,
                ReceiverID = a.ReceiverID,
                Message = a.Message,
                MessageID = a.MessageID,
                DateSent = a.DateSent,
                Advertisement = new Advertisement
                {
                    CarID = a.Advertisement.CarID,
                    UserID = a.Advertisement.UserID,
                    AdverID = a.Advertisement.AdverID,
                    AdverName = a.Advertisement.AdverName,
                    Price = a.Advertisement.Price,
                    UserDto = _adverUtility.ConvertToUserDto(a.Advertisement.User),
                    CarDto = _adverUtility.ConvertToCarDto(a.Advertisement.Car),
                    imagePaths = a.Advertisement.imagePaths,
                    FavoritedByUserDto = a.Advertisement.FavoritedByUsers
                            .Select(f => new FavoritedByUserDto
                            {
                                UserID = f.UserID,
                                AdverID = f.AdverID
                            })
                            .ToList()
                }
            }).Where(a => a.SenderID == userID || a.ReceiverID == userID).ToList();
        }
        public ICollection<Messages> GetMessages(int userID,int targetID, int adverID)
        {
            return _dataContext.Messages.Select(a=> new Messages { 
                AdverID = a.AdverID,
                SenderID = a.SenderID,
                ReceiverID = a.ReceiverID,
                Message = a.Message,
                MessageID = a.MessageID,
                DateSent = a.DateSent,
                Advertisement = a.Advertisement
            }).Where(a=>(a.ReceiverID == userID || a.SenderID == userID) && (a.SenderID == targetID || a.ReceiverID == targetID) && a.AdverID == adverID)
            .OrderBy(a => a.DateSent)
            .ToList();
        }
    }
}
