using CarWebShop.Dto;
using CarWebShop.Interfaces;
using CarWebShop.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Security.Claims;
using System.Text.Json.Serialization;
using System.Text.Json;

namespace CarWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdvertisementController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IAdverRepository _repository;
        public AdvertisementController(IConfiguration configuration, IAdverRepository adverRepository)
        {
            _configuration = configuration;
            _repository = adverRepository;
        }
        
        [HttpPost("PublishAdvertisement")]
        [Authorize]
        public IActionResult PublishAdvertisement(AdverDto adverDto)
        {
            int UserID = GetUserIdByUsername(adverDto.UserName);
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            SqlConnection connection = new SqlConnection(connectionString);
            string query = "INSERT INTO Cars(CarBrand, CarModel, CarYear, CarType, FuelType, OwnerID) VALUES('" + adverDto.Brand + "', '" + adverDto.Model + "', '" + adverDto.Year + "', '" + adverDto.Type + "', '" + adverDto.FuelType + "', '" + UserID + "' )";
            SqlCommand command = new SqlCommand(query);

            // Associate the SqlCommand with the SqlConnection
            command.Connection = connection;

            connection.Open();

            int i = command.ExecuteNonQuery();

            // Now, execute the query to get the ID of the newly inserted row
            string getIdQuery = "SELECT @@IDENTITY";
            SqlCommand getIdCommand = new SqlCommand(getIdQuery, connection);
            int newCarID = Convert.ToInt32(getIdCommand.ExecuteScalar());
            connection.Close();
            InsertIntoAdver(adverDto, newCarID, UserID);
            if (i > 0)
            {
                return Ok();
            }
            else return BadRequest();
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public IActionResult InsertIntoAdver(AdverDto adverDto, int carID, int UserID)
        {
            
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            SqlConnection connection = new SqlConnection(connectionString);
            string query = "INSERT INTO Advertisement(AdverName, UserID, CarID) VALUES('" + adverDto.AdverName + "', '" +UserID+ "', '" + carID + "')";
            SqlCommand command = new SqlCommand(query);
            command.Connection = connection;
            connection.Open();
            int i = command.ExecuteNonQuery();
            connection.Close();
            if (i > 0)
            {
                return Ok();
            }
            else return BadRequest();

        }
        [ApiExplorerSettings(IgnoreApi = true)]
        public int GetUserIdByUsername(string username)
        {
            int userId = 0;
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string query = "SELECT UserID FROM Users WHERE UserName = @Username";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Username", username);
                    var result = command.ExecuteScalar();
                    if (result != DBNull.Value)
                    {
                        userId = Convert.ToInt32(result);
                    }
                }
                
            }
            return userId;
        }
        [HttpPost("MarkAsFavorite")]
        [Authorize]
        public IActionResult markAsFavorite(FavoritesDto favoritesDto)
        {

            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            int UserID = GetUserIdByUsername(favoritesDto.UserName);
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                // Use parameterized query to prevent SQL injection
                string query = "INSERT INTO Favorites (AdverID, UserID) VALUES (@AdverID, @UserID)";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    // Add parameters to the SqlCommand
                    command.Parameters.AddWithValue("@AdverID", favoritesDto.AdverID);
                    command.Parameters.AddWithValue("@UserID", UserID);

                    connection.Open();

                    int rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return Ok(); // Successfully inserted
                    }
                    else
                    {
                        return BadRequest("Insertion failed"); // Insertion failed
                    }
                }
            }
        }
        private LoginRequestDto GetCurrentUser()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (identity != null)
            {
                var userClaims = identity.Claims;

                return new LoginRequestDto
                {
                    UserName = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.NameIdentifier)?.Value
                };
            }
            return null;
        }

        [HttpGet("GetAdvertisements")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Advertisement>))]
        public ActionResult<IEnumerable<Advertisement>> GetAdvertisements()
        {
            var Advers = _repository.GetAdvertisements();
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
    }

    
}
