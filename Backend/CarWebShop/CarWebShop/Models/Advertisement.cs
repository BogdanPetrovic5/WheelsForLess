using System.ComponentModel.DataAnnotations;

namespace CarWebShop.Models
{
    public class Advertisement
    {
        [Key]
        public int AdverID { get; set; }
        
        public int UserID { get; set; }
        public string AdverName { get; set; }
        public int CarID { get; set; }
        public Car Car { get; set; }
        public User User { get; set; }
        
    }
}
