using CarWebShop.Dto;
using CarWebShop.Interfaces;
using CarWebShop.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Security.Claims;
using System.Text.Json.Serialization;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using CarWebShop.Data;
using CarWebShop.Utilities;

namespace CarWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdvertisementController : Controller
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private readonly IAdverRepository _repository;
        private readonly AdverUtility _adverUtility;
        private readonly UserUtility _userUtility;
        public AdvertisementController(IConfiguration configuration, IAdverRepository adverRepository, DataContext context, AdverUtility adverUtility, UserUtility userUtility)
        {
            _configuration = configuration;
            _repository = adverRepository;
            _context = context;
            _adverUtility = adverUtility;
            _userUtility = userUtility;
        }
        
        [HttpPost("PublishAdvertisement")]
        [Authorize]
        public async Task<IActionResult>  PublishAdvertisement([FromForm] AdverDto adverDto,  List<IFormFile> selectedImages)
        {
            int UserID = _userUtility.GetUserIdByUsername(adverDto.UserName);
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            SqlConnection connection = new SqlConnection(connectionString);
            string query = "INSERT INTO Cars(CarBrand, CarModel, CarYear, CarType, FuelType,Propulsion, EngineVolume, HorsePower, Mileage, OwnerID) VALUES('" + adverDto.Brand + "', '" + adverDto.Model + "', '" + adverDto.Year + "', '" + adverDto.Type + "', '" + adverDto.FuelType + "', '" + adverDto.Propulsion + "' , '" + adverDto.EngineVolume + "' ,'" + adverDto.HorsePower + "','" + adverDto.Mileage + "','" + UserID + "' )";
            SqlCommand command = new SqlCommand(query);

            
            command.Connection = connection;

            connection.Open();

            int i = command.ExecuteNonQuery();


            string getIdQuery = "SELECT @@IDENTITY";
            SqlCommand getIdCommand = new SqlCommand(getIdQuery, connection);
            int newCarID = Convert.ToInt32(getIdCommand.ExecuteScalar());
            connection.Close();
            await InsertIntoAdver(adverDto, newCarID, UserID, selectedImages);


            if (i > 0)
            {
                return Ok();
            }
            else return BadRequest();
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> InsertIntoAdver([FromForm] AdverDto adverDto, int carID, int UserID, List<IFormFile> selectedImages)
        {
            
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            SqlConnection connection = new SqlConnection(connectionString);
            string query = "INSERT INTO Advertisement(AdverName, UserID, CarID, Price) VALUES('" + adverDto.AdverName + "', '" +UserID+ "', '" + carID + "', '"+ adverDto.Price +"')";
            SqlCommand command = new SqlCommand(query);
            command.Connection = connection;
            connection.Open();
            int i = command.ExecuteNonQuery();
            string getIdQuery = "SELECT @@IDENTITY";
            SqlCommand getIdCommand = new SqlCommand(getIdQuery, connection);
            int AdverID = Convert.ToInt32(getIdCommand.ExecuteScalar());
            connection.Close();
            await _adverUtility.createFolder(AdverID, adverDto.UserName, adverDto, selectedImages);
            if (i > 0)
            {
                return Ok();
            }
            else return BadRequest();

        }
       
       
        [HttpPost("MarkAsFavorite")]
        [Authorize]
        public IActionResult markAsFavorite(FavoritesDto favoritesDto)
        {

            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            string query;
            int UserID = _userUtility.GetUserIdByUsername(favoritesDto.UserName);
            bool duplicate = _adverUtility.checkForDuplicates(favoritesDto, UserID);
            using (SqlConnection connection = new SqlConnection(connectionString))
            {

                if (duplicate)
                {
                    query = "DELETE FROM Favorites WHERE AdverID = @AdverID and UserID = @UserID";
                }
                else
                {
                    query = "INSERT INTO Favorites (AdverID, UserID) VALUES (@AdverID, @UserID)";
                }


                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    //Parameters
                    command.Parameters.AddWithValue("@AdverID", favoritesDto.AdverID);
                    command.Parameters.AddWithValue("@UserID", UserID);

                    connection.Open();

                    int rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return Ok(); // Success
                    }
                    else
                    {
                        return BadRequest(); // Failure
                    }
                }
            }
        }
        [HttpGet("GetAdvertisements")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Advertisement>))]
        public ActionResult<IEnumerable<Advertisement>> GetAdvertisements(int page = 1, int maximumAdvers = 6)
        {
            var Advers = _repository.GetAdvertisements().Skip((page - 1) * maximumAdvers)
                .Take(maximumAdvers)
                .ToList();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var options = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.Preserve
            };

            return Json(Advers);
        }
        [HttpGet("GetFavorites")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Advertisement>))]
        public ActionResult<IEnumerable<Advertisement>> GetFavoriteAdvertisements(string username, int page = 1, int maximumAdvers = 18)
        {
            int userID = _userUtility.GetUserIdByUsername(username);
            var Advers = _repository.GetFavorites(userID).ToList();
            if(Advers == null)
            {
                return NotFound();
            }
            var options = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.Preserve
            };

            return Json(Advers);
        }
    }

    
}
