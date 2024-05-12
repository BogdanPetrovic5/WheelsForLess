using CarWebShop.Dto;

namespace CarWebShop.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public ICollection<Advertisement> Advertisements { get; set; }
        public ICollection<Car> Cars { get; set; }
        public ICollection<Favorites> FavoriteAdvertisements { get; set; }

        public ICollection<Messages> SentMessages { get; set; }
        public ICollection<Messages> ReceivedMessages { get; set; }
    }
}
