using CarWebShop.Data;
using CarWebShop.Interfaces;
using CarWebShop.Models;

namespace CarWebShop.Repository
{
    public class CarsRepository : ICarRepository
    {
        private readonly DataContext _context;
        public CarsRepository(DataContext context) { 
            _context = context;
        }
        public ICollection<Car> GetCars() { 
            return _context.Cars.OrderBy(p => p.CarID).ToList();
        }
    }
}
