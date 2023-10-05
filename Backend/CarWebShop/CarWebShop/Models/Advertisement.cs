namespace CarWebShop.Models
{
    public class Advertisement
    {
        public int AdverID { get; set; }
        public int CarID { get; set; }
        public int UserID { get; set; }
        public Car Car { get; set; }
        public User User { get; set; }
        
    }
}
