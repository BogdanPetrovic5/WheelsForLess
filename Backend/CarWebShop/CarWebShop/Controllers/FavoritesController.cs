using CarWebShop.Dto;
using CarWebShop.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace CarWebShop.Controllers
{
    
    public class FavoritesController : Controller
    {
        public IConfiguration _configuration { get; set; }
        public FavoritesController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
       
    }
}
