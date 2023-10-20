using CarWebShop.Dto;
using CarWebShop.Models;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Metrics;

namespace CarWebShop.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<Advertisement> Advertisement { get; set; }
        public DbSet<Car> Cars { get; set; }

        public DbSet<User> Users { get; set; }
        public DbSet<Favorites> Favorites { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            modelBuilder.Entity<CarDto>().HasNoKey();
            modelBuilder.Entity<UserDto>().ToView("UserDto_View").HasNoKey();
            modelBuilder.Entity<Car>().HasKey(c => c.CarID);
            modelBuilder.Entity<User>().HasKey(c => c.UserID);
            modelBuilder.Entity<Advertisement>().HasKey(c => c.AdverID);

            
            //One-to-many user can have multiple Cars
            modelBuilder.Entity<Car>()
                .HasOne(c => c.Owner)
                .WithMany(o => o.Cars)
                .HasForeignKey(c => c.OwnerID).OnDelete(DeleteBehavior.ClientSetNull);

            //One to one one car is in relationship to only one advertisment
            modelBuilder.Entity<Advertisement>()
                .HasOne(c => c.Car)
                .WithOne(a => a.Advertisement)
                .HasForeignKey<Advertisement>(c => c.CarID);


            //One-to-many user can have multiple advertisments

            modelBuilder.Entity<Advertisement>()
                .HasOne(c => c.User)
                .WithMany(o => o.Advertisements)
                .HasForeignKey(c => c.UserID).OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<Favorites>()
            .HasKey(favorite => new { favorite.UserID, favorite.AdverID });

            modelBuilder.Entity<Favorites>()
                .HasOne(favorite => favorite.User)
                .WithMany(user => user.FavoriteAdvertisements)
                .HasForeignKey(favorite => favorite.UserID);

            modelBuilder.Entity<Favorites>()
                .HasOne(favorite => favorite.Advertisement)
                .WithMany(advertisement => advertisement.FavoritedByUsers)
                .HasForeignKey(favorite => favorite.AdverID);

        }
    }
}

