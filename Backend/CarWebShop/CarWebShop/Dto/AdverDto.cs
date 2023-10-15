using CarWebShop.Models;

namespace CarWebShop.Dto
{
    public class AdverDto
    {
        public int AdverID { get; set; }
        public string AdverName { get; set; }
        public int UserID { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string Year { get; set; }
        public string Type { get; set; }
        public string FuelType { get; set; }
        public UserDto UserDto { get; set; }
        public Car Car { get; set; }
    }
}
