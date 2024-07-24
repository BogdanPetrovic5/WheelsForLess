using CarWebShop.Dto;
using CarWebShop.Models;

namespace CarWebShop.Interfaces
{
    public interface IAdverRepository
    {

        ICollection<Advertisement> GetAdvertisements();
        ICollection<Advertisement> GetFavorites(int userID);
        ICollection<Advertisement> GetFilteredAdvertisements(AdvertisementFilter filter);
    }
}
