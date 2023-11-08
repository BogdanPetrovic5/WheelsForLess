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

namespace CarWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdvertisementController : Controller
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private readonly IAdverRepository _repository;
        public AdvertisementController(IConfiguration configuration, IAdverRepository adverRepository, DataContext context)
        {
            _configuration = configuration;
            _repository = adverRepository;
            _context = context; 
        }
        
        [HttpPost("PublishAdvertisement")]
        [Authorize]
        public IActionResult PublishAdvertisement([FromForm] AdverDto adverDto,  List<IFormFile> selectedImages)
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
            InsertIntoAdver(adverDto, newCarID, UserID, selectedImages);


            if (i > 0)
            {
                return Ok();
            }
            else return BadRequest();
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public IActionResult InsertIntoAdver([FromForm] AdverDto adverDto, int carID, int UserID,  List<IFormFile> selectedImages)
        {
            
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            SqlConnection connection = new SqlConnection(connectionString);
            string query = "INSERT INTO Advertisement(AdverName, UserID, CarID) VALUES('" + adverDto.AdverName + "', '" +UserID+ "', '" + carID + "')";
            SqlCommand command = new SqlCommand(query);
            command.Connection = connection;
            connection.Open();
            int i = command.ExecuteNonQuery();
            string getIdQuery = "SELECT @@IDENTITY";
            SqlCommand getIdCommand = new SqlCommand(getIdQuery, connection);
            int AdverID = Convert.ToInt32(getIdCommand.ExecuteScalar());
            connection.Close();
            createFolder(AdverID, adverDto.UserName, adverDto, selectedImages);
            if (i > 0)
            {
                return Ok();
            }
            else return BadRequest();

        }
        [ApiExplorerSettings(IgnoreApi = true)]
        public void createFolder(int adverID, string username, [FromForm] AdverDto adverDto,  List<IFormFile> selectedImages)
        {
            string adverFolderName = adverID.ToString();
            string adverFolderPath = Path.Combine("wwwroot/Photos/" + username, adverFolderName);
            Directory.CreateDirectory(adverFolderPath);

            foreach (var formFile in selectedImages)
            {
                if (formFile.Length > 0)
                {
                    string fileName = Path.GetFileName(formFile.FileName);
                    string filePath = Path.Combine(adverFolderPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        formFile.CopyTo(stream);
                    }
                    var imagePath = new ImagePaths
                    {
                        AdverID = adverID,      // Associate the image path with the advertisement
                        ImagePath = Path.Combine(username, adverID.ToString(), fileName) // Store the relative path
                    };

                    // Add the imagePath to the context and save it in the database
                    _context.ImagePaths.Add(imagePath); // Add the entity to the DbSet
                    _context.SaveChanges();
                }
            }

            // Process and save each image

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
            string query;
            int UserID = GetUserIdByUsername(favoritesDto.UserName);
            bool duplicate = checkForDuplicates(favoritesDto, UserID);
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                // Use parameterized query to prevent SQL injection
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
                        return BadRequest(); // Insertion failed
                    }
                }
            }
        }
        [ApiExplorerSettings(IgnoreApi = true)]
        public bool checkForDuplicates(FavoritesDto favoritesDto, int UserID)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using(SqlConnection connection = new SqlConnection(connectionString))
            {
                string query = "SELECT 1 FROM Favorites WHERE AdverID = @AdverID AND UserID = @UserID";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@AdverID", favoritesDto.AdverID);
                    command.Parameters.AddWithValue("UserID", UserID);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            // Row with the specified AdverID and UserID exists
                            return true;
                        }
                        else
                        {
                            // Row does not exist
                            return false;
                        }
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
