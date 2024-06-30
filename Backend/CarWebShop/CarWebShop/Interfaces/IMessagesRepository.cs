using CarWebShop.Models;

namespace CarWebShop.Interfaces
{
    public interface IMessagesRepository
    {
        ICollection<Messages> GetMessages(int userID);
        ICollection<Messages> GetMessages(int currentUserID, int initialSenderId, int adverID);
    }
}
