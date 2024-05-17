using Azure;
using CarWebShop.Dto;
using CarWebShop.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Web.Http.Cors;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace CarWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistrationController : ControllerBase
    {
        public readonly PasswordEncoder _encodedPassword;
        public readonly string baseFolderPath;
        public string userFolderName;

        private readonly IConfiguration _configuration;
        public RegistrationController(IConfiguration configuration, PasswordEncoder passwordEncoder)
        {
            _configuration = configuration;
            baseFolderPath = Path.Combine("wwwroot", "Photos");
            _encodedPassword = passwordEncoder;
        }

        [HttpPost]
        [Route("Registration")]


        public IActionResult Registration(RegisterRequestDto user)
        {
            using (SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                string query = "SELECT COUNT(*) FROM Users WHERE UserName = @UserName OR PhoneNumber = @PhoneNumber";

                using (SqlCommand checkCommand = new SqlCommand(query, connection))
                {
                    checkCommand.Parameters.AddWithValue("@UserName", user.UserName);
                    checkCommand.Parameters.AddWithValue("@PhoneNumber", user.PhoneNumber);

                    connection.Open();
                    int userCount = (int)checkCommand.ExecuteScalar();

                    if (userCount > 0)
                    {
                        return Conflict();
                    }
                    else
                    {
                        connection.Close();
                        string queryInsert = "INSERT INTO Users (FirstName, LastName, UserName, PhoneNumber, Password) " + "VALUES (@FirstName, @LastName, @UserName, @PhoneNumber, @Password)";
                        string encodedPassword = _encodedPassword.EncodePassword(user.Password);
                        using (SqlCommand command = new SqlCommand(queryInsert, connection))
                        {

                            command.Parameters.AddWithValue("@FirstName", user.FirstName);
                            command.Parameters.AddWithValue("@LastName", user.LastName);
                            command.Parameters.AddWithValue("@UserName", user.UserName);
                            command.Parameters.AddWithValue("@PhoneNumber", user.PhoneNumber);
                            command.Parameters.AddWithValue("@Password", encodedPassword);
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
            }
        }
    }

}

