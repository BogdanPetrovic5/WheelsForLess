using CarWebShop.Models;

namespace CarWebShop.Dto
{
    public class MessageDto
    {
        public string Message { get; set; }
        public string SenderUsername { get; set; }
        public string ReceiverUsername { get; set; }
        public int AdverID { get; set; }
        
    }
}
