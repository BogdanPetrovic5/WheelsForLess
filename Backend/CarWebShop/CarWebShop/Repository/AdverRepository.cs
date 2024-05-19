﻿using CarWebShop.Data;
using CarWebShop.Dto;
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
        private static UserDto ConvertToUserDto(User user)
        {
            return new UserDto
            {
                UserID = user.UserID,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                PhoneNumber = user.PhoneNumber,

            };
        }
        private static CarDto ConvertToCarDto(Car car)
        {
            return new CarDto
            {
               
                Brand = car.CarBrand,
                Model = car.CarModel,
                Type = car.CarType,
                FuelType = car.FuelType,
                Year = car.CarYear,
                CarID = car.CarID,
                Propulsion = car.Propulsion,
                HorsePower = car.HorsePower,
                EngineVolume = car.EngineVolume,
                Mileage = car.Mileage
            };
        }
        private static FavoritedByUserDto ConvertToFavoritedByUserDto(Favorites favorites)
        {
            return new FavoritedByUserDto
            {
                UserID = favorites.UserID,
                AdverID = favorites.AdverID
            };
        }
        public ICollection<Advertisement> GetAdvertisements()
        {
            return _context.Advertisement
                .Select(a => new Advertisement
                {

                    CarID = a.CarID,
                    UserID = a.UserID,
                    AdverID = a.AdverID,
                    AdverName = a.AdverName,
                    Price = a.Price,
                    UserDto = ConvertToUserDto(a.User),
                    CarDto = ConvertToCarDto(a.Car),
                    imagePaths = a.imagePaths,
                    FavoritedByUserDto = a.FavoritedByUsers
                            .Select(f => new FavoritedByUserDto
                            {
                                UserID = f.UserID,
                                AdverID = f.AdverID
                            })
                            .ToList()

                })
                .OrderBy(a => a.AdverID)
                .ToList();
        }

        public ICollection<Advertisement> GetFavorites(int userID)
        {
            return _context.Advertisement.Select(a => new Advertisement
            {

                CarID = a.CarID,
                UserID = a.UserID,
                AdverID = a.AdverID,
                AdverName = a.AdverName,
                Price = a.Price,
                UserDto = ConvertToUserDto(a.User),
                CarDto = ConvertToCarDto(a.Car),
                imagePaths = a.imagePaths,
                FavoritedByUserDto = a.FavoritedByUsers
                            .Select(f => new FavoritedByUserDto
                            {
                                UserID = f.UserID,
                                AdverID = f.AdverID
                            })
                            .ToList()




            }).Where(a => a.FavoritedByUserDto.Any(f => f.UserID == userID)).ToList();
        }

    }
}