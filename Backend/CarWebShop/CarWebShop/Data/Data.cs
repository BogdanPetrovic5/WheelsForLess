using CarWebShop.Models;
using Microsoft.EntityFrameworkCore;

namespace CarWebShop.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options){
            
            
        }
        
        public DbSet<Advertisement> Advertisement { get; set;}
        public DbSet<Car> Cars { get; set; }
        
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            modelBuilder.Entity<Car>().HasKey(c => c.CarID);
            modelBuilder.Entity<User>().HasKey(c => c.UserID);
            modelBuilder.Entity<Advertisement>().HasKey(c => c.AdverID);
            //One-to-many user can have multiple Cars
            modelBuilder.Entity<Car>()
                .HasOne(c => c.Owner)
                .WithMany(o => o.Cars)
                .HasForeignKey(c => c.OwnerID).OnDelete(DeleteBehavior.ClientSetNull);

            //One to one one car is in relationship to only one advertisment
            modelBuilder.Entity<Car>()
                .HasOne(c => c.Advertisement)
                .WithOne(o => o.Car)
                .HasForeignKey<Advertisement>(c => c.AdverID).OnDelete(DeleteBehavior.ClientSetNull);


            //One-to-many user can have multiple advertisments

            modelBuilder.Entity<Advertisement>()
                .HasOne(c => c.User)
                .WithMany(o => o.Advertisements)
                .HasForeignKey(c => c.UserID).OnDelete(DeleteBehavior.ClientSetNull);



        }
        /*protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //AdverOwner relation
            modelBuilder.Entity<AdverOwner>().HasKey(key => new { key.UserID, key.AdverID });
            modelBuilder.Entity<AdverOwner>().HasOne(key => key.Advertisement).WithMany(key => key.AdverOwners)
                .HasForeignKey(key => key.AdverID);
            modelBuilder.Entity<AdverOwner>().HasOne(key => key.User).WithMany(key => key.AdverOwners)
                .HasForeignKey(key => key.UserID);

            //CarOwner relation
            modelBuilder.Entity<CarOwner>().HasKey(key => new { key.CarID, key.UserID });
            modelBuilder.Entity<CarOwner>().HasOne(key => key.Car).WithMany(key => key.CarOwners)
                .HasForeignKey(key => key.CarID);
            modelBuilder.Entity<CarOwner>().HasOne(key => key.User).WithMany(key => key.CarOwners)
                .HasForeignKey(key => key.UserID);

        }*/
    }
}
