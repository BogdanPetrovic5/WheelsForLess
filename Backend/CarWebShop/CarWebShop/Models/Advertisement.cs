namespace CarWebShop.Models
{
    public class Advertisement
    {
        public int AdverID { get; set; }
        public Car Car { get; set; }
        public Owner Owner { get; set; }
        public ICollection<AdverOwner> AdverOwners { get; set; }
    }
}
