namespace CarWebShop.Models
{
    public class CarOwner
    {
        public int CarID { get; set; }
        public int OwnerID { get; set; }
        public int nesto { get; set; }
        public ICollection<Car> Cars { get; set; }
        public ICollection<Owner> Owners { get; set; }
    }
}
