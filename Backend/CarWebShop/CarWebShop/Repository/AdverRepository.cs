using CarWebShop.Data;
using CarWebShop.Interfaces;
using CarWebShop.Models;
using Microsoft.EntityFrameworkCore;

namespace CarWebShop.Repository
{
    public class AdverRepository : IAdverRepository
    {
        private readonly DataContext _context;
        public AdverRepository(DataContext context)
        {
            _context = context;
        }
        public ICollection<Advertisement> GetAdvertisements()
        {
            return _context.Advertisement.Include(a => a.Car)
                   .Include(a => a.User)
                   .OrderBy(a => a.AdverID)
                   .ToList();
        }
    }
}
