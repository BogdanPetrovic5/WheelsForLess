namespace CarWebShop.Models
{
    public class UserSession
    {
        public int SessionID { get; set; }
        public int UserID { get; set; }
        public int SessionToken { get; set; }
        public DateTime LastActivityTime { get; set; }
      
    }
}
