using CarWebShop.Data;
using CarWebShop.Interfaces;
using CarWebShop.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Identity.Client;

namespace CarWebShop.Repository
{
    public class MessageRepository : IMessagesRepository
    {
        private readonly DataContext _dataContext;
        public MessageRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
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


            }).Where(a => a.SenderID == userID || a.ReceiverID == userID).ToList();
        }
        public ICollection<Messages> GetMessages(int userID, int adverID)
        {
            return _dataContext.Messages.Select(a=> new Messages { 
                AdverID = a.AdverID,
                SenderID = a.SenderID,
                ReceiverID = a.ReceiverID,
                Message = a.Message,
                MessageID = a.MessageID,
            
            
            }).Where(a => a.SenderID == userID || a.ReceiverID == userID).ToList();
        }
    }
}
