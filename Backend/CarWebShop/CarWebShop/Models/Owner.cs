namespace CarWebShop.Models
{
    public class Owner
    {
        public int OwnerID { get; set; }
        public ICollection<Advertisement> Advertisements { get; set; }
        public ICollection<Car> Cars { get; set; }
        public ICollection<AdverOwner> AdverOwners { get; set; }
        public ICollection<CarOwner> CarOwners { get; set; }
    }
}
