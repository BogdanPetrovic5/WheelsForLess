using CarWebShop.Dto;
using CarWebShop.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Security.Claims;

namespace CarWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdvertisementController : Controller
    {
        private readonly IConfiguration _configuration;
        public AdvertisementController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpPost("PublishAdvertisement")]
        [Authorize]
        public IActionResult PublishAdvertisement(AdverDto adverDto)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            SqlConnection connection = new SqlConnection(connectionString);
            string query = "INSERT INTO Cars(CarBrand, CarModel, CarYear, CarType, FuelType, OwnerID) VALUES('" + adverDto.Brand + "', '" + adverDto.Model + "', '" + adverDto.Year + "', '" + adverDto.Type + "', '" + adverDto.FuelType + "', '" + adverDto.UserID + "' )";
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
            InsertIntoAdver(adverDto, newCarID);
            if (i > 0)
            {
                return Ok();
            }
            else return BadRequest();
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public IActionResult InsertIntoAdver(AdverDto adverDto, int carID)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            SqlConnection connection = new SqlConnection(connectionString);
            string query = "INSERT INTO Advertisement(AdverName, UserID, CarID) VALUES('" + adverDto.AdverName + "', '" + adverDto.UserID + "', '" + carID + "')";
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
    }
}
