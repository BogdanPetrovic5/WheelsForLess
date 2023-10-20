namespace CarWebShop.Models
{
    public class Favorites
    {
        
        public int UserID { get; set; }
        public User User { get; set; }
        public int AdverID { get; set; }
        public Advertisement Advertisement { get; set; }

    }
}
