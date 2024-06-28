using CarWebShop.Data;
using CarWebShop.Dto;
using CarWebShop.Interfaces;
using CarWebShop.Models;
using CarWebShop.Utilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Identity.Client;

namespace CarWebShop.Repository
{
    public class MessageRepository : IMessagesRepository
    {
        private readonly DataContext _dataContext;
        private readonly AdverUtility _adverUtility;
        private readonly UserUtility _userUtility;
        public MessageRepository(DataContext dataContext, AdverUtility adverUtility, UserUtility userUtility)
        {
            _dataContext = dataContext;
            _adverUtility = adverUtility;
            _userUtility = userUtility;
        }
        public ICollection<Messages> GetMessages(int userID)
        {
            var userMessages = _dataContext.Messages
                .Where(m => m.ReceiverID == userID || m.SenderID == userID)
                .Include(m => m.Advertisement)
                .ThenInclude(a => a.User)      
                .Include(m => m.Advertisement.Car) 
                .Include(m => m.Advertisement.FavoritedByUsers) 
                .ToList();

            var latestMessages = userMessages
           .GroupBy(m => m.AdverID)
           .Select(g => g.OrderByDescending(m => m.DateSent).FirstOrDefault())
           .ToList();
            var result = latestMessages.Select(a => new Messages
            {
                AdverID = a.AdverID,
                SenderID = a.SenderID,
                ReceiverID = a.ReceiverID,
                Message = a.Message,
                MessageID = a.MessageID,
                DateSent = a.DateSent,
                ReceiverUsername = _userUtility.GetUsernameById(a.ReceiverID),
                SenderUsername = _userUtility.GetUsernameById(a.SenderID),
                Advertisement = a.Advertisement != null ? new Advertisement
                {
                    CarID = a.Advertisement.CarID,
                    UserID = a.Advertisement.UserID,
                    AdverID = a.Advertisement.AdverID,
                    AdverName = a.Advertisement.AdverName,
                    Price = a.Advertisement.Price,
                    UserDto = _adverUtility.ConvertToUserDto(a.Advertisement.User),
                    CarDto = _adverUtility.ConvertToCarDto(a.Advertisement.Car),
                    imagePaths = a.Advertisement.imagePaths,
                    Messages = a.Advertisement.Messages.Select(m => new Messages
                    {
                        DateSent = m.DateSent,
                        SenderID = m.SenderID,
                        ReceiverID = m.ReceiverID,
                        Message = m.Message,
                        SenderUsername = _userUtility.GetUsernameById(m.SenderID),
                        ReceiverUsername = _userUtility.GetUsernameById(m.ReceiverID),
                       
                    }).ToList(),
                    FavoritedByUserDto = a.Advertisement.FavoritedByUsers
                    .Select(f => new FavoritedByUserDto
                        {
                            UserID = f.UserID,
                            AdverID = f.AdverID
                        })
                        .ToList()
                } : null
            }).ToList();



            return result;
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
