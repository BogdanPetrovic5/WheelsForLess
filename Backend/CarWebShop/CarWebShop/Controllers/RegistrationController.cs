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
            //First check if user exists if not procceed to elsewise return conflict

            using (SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                SqlCommand checkCommand = new SqlCommand("SELECT COUNT(*) FROM Users WHERE UserName = '" + user.UserName + "' AND PhoneNumber = '" + user.PhoneNumber + "'");

                connection.Open();
                checkCommand.Connection = connection;
                SqlDataReader sqlDataReader = checkCommand.ExecuteReader();
                if (sqlDataReader.Read())
                {
                    int existingUsers = sqlDataReader.GetInt32(0);
                    if (existingUsers > 0)
                    {
                        connection.Close();
                        return Conflict();
                    }
                    else
                    {
                        connection.Close();
                        SqlCommand command = new SqlCommand
                          ("INSERT INTO Users(FirstName, LastName, UserName, PhoneNumber,Password) " +
                          "values('" + user.FirstName + "','" + user.LastName + "', '" + user.UserName + "', '" + user.PhoneNumber + "', '" + user.Password + "')", connection);

                        connection.Open();
                        command.Connection = connection;
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
                return Ok();
            }
        }
    }

}

