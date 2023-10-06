using CarWebShop.Models;

namespace CarWebShop.Interfaces
{
    public interface ICarRepository
    {
        ICollection<Car> GetCars();

    }
}
