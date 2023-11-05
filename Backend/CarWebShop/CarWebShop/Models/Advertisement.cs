using CarWebShop.Dto;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarWebShop.Models
{
    public class Advertisement
    {
        [Key]
        public int AdverID { get; set; }

        public int UserID { get; set; }
        public string AdverName { get; set; }
        public int CarID { get; set; }
        public Car Car { get; set; }
        public User User { get; set; }
        [NotMapped]
        public UserDto UserDto { get; set; }
        [NotMapped]
        public CarDto CarDto { get; set; }
        public ICollection<ImagePaths> imagePaths { get; set; }
        public ICollection<Favorites> FavoritedByUsers { get; set; }
    }
}
