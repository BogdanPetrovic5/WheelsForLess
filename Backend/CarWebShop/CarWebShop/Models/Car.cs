namespace CarWebShop.Models
{
    public class Car
    {
        public int CarID { get; set; }
        public string CarBrand { get; set; }
        public string CarModel { get; set; }
        public string CarType { get; set; }
        public string CarYear { get; set; }
        public int OwnerID { get; set; }
        
        public Advertisement Advertisement { get; set; }
        public User Owner { get; set; }
        
    }
}
