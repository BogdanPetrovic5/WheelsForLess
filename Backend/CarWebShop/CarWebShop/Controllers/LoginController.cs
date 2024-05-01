using CarWebShop.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace CarWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        private readonly IConfiguration _configuration;
        public LoginController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        [Route("Login")]
        public IActionResult Login(LoginRequestDto user)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                // Use parameterized query to prevent SQL injection
                string query = "SELECT * FROM Users WHERE UserName = @UserName AND Password = @Password";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    // Add parameters to the SqlCommand
                    command.Parameters.AddWithValue("@UserName", user.UserName);
                    command.Parameters.AddWithValue("@Password", user.Password);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            var token = Generate(user);
                            return Json(Ok(token));
                        }
                        else
                        {
                            // User not found
                            return NotFound(); 
                        }
                    }
                }
            }

        }
        [ApiExplorerSettings(IgnoreApi = true)]
        public string Generate(LoginRequestDto user)
        {
            var securutyKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securutyKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                 new Claim(ClaimTypes.NameIdentifier, user.UserName)
                

             };
            var token = new JwtSecurityToken(_configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"], 
                claims, 
                expires:DateTime.Now.AddDays(366),
                signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(token);

        }
    }
}
