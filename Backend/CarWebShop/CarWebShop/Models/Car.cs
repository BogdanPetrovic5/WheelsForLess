namespace CarWebShop.Models
{
    public class Car
    {
        public int CarId { get; set; }
        public string CarBrand { get; set; }
        public string CarModel { get; set; }
        public string CarType { get; set; }
        public string CarYear { get; set; }
        public Advertisement Advertisement { get; set; }
        public Owner Owner { get; set; }
        public ICollection<CarOwner> CarOwners { get; set; }
    }
}
