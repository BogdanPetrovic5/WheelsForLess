using Azure;
using CarWebShop.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Web.Http.Cors;

namespace CarWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistrationController : ControllerBase
    {
        public readonly string baseFolderPath;
        public string userFolderName;
       
        private readonly IConfiguration _configuration;
        public RegistrationController(IConfiguration configuration)
        {
            _configuration = configuration;
            baseFolderPath = Path.Combine("wwwroot", "Photos");
            
        }
        
        [HttpPost]
        [Route("Registration")]

        
        public IActionResult Registration(RegisterRequestDto user)
        {
            SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            SqlCommand command = new SqlCommand
                ("INSERT INTO Users(FirstName, LastName, UserName, PhoneNumber,Password) values('" + user.FirstName + "','" + user.LastName + "', '" + user.UserName + "', '" + user.PhoneNumber + "', '" + user.Password + "')", connection);
            connection.Open();
            userFolderName = user.UserName;
            string userFolderPath = Path.Combine(baseFolderPath, userFolderName);
            if (!Directory.Exists(userFolderPath))
            {
                Directory.CreateDirectory(userFolderPath);
            }
            int i = command.ExecuteNonQuery();
            connection.Close();

            if (i > 0)
            {
                return Ok(); // Return 200 OK status
            }
            else
            {
                return BadRequest(); // Return 400 Bad Request status
            }
        }

    }
}
