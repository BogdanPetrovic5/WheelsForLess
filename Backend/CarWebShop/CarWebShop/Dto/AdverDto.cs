using CarWebShop.Models;

namespace CarWebShop.Dto
{
    public class AdverDto
    {
        public int AdverID { get; set; }
        public string AdverName { get; set; }
        public string UserName { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string Year { get; set; }
        public string Type { get; set; }
        public string FuelType { get; set; }
        
        public float Price { get; set; }
        public string Propulsion { get; set; }
        public string EngineVolume { get; set; }
        public string HorsePower { get; set; }
        public string Mileage { get; set; }

    }
}
