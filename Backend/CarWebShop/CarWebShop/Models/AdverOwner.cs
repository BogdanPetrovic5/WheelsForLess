namespace CarWebShop.Models
{
    public class AdverOwner
    {
        public int AdverID { get; set; }
        public int OwnerID { get; set; }
        public Advertisement Advertisement { get; set; }
        public Owner Owner { get; set; }
    }
}
