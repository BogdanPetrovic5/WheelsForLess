using CarWebShop.Dto;
using CarWebShop.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace CarWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        private readonly PasswordEncoder _passwordEncoder;
        private readonly IConfiguration _configuration;
        public LoginController(IConfiguration configuration, PasswordEncoder password)
        {
            _configuration = configuration;
            _passwordEncoder = password;
        }

        [HttpPost]
        [Route("Login")]
        public IActionResult Login(LoginRequestDto user)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                
                string query = "SELECT * FROM Users WHERE UserName = @UserName";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    
                    command.Parameters.AddWithValue("@UserName", user.UserName);
                   

                    connection.Open();
                   
                   
                     //Checks if hashed stored password is same as the provided password from the user on login.
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            string hashedPassword = reader["Password"].ToString();
                            bool passwordCheck = _passwordEncoder.VerifyPassword(user.Password, hashedPassword);
                            if (passwordCheck)
                            {
                                var token = Generate(user);
                                var cookieOptions = new CookieOptions
                                {
                                    HttpOnly = true,
                                    Expires = DateTime.Now.AddMinutes(30)
                                };
                                Response.Cookies.Append("jwtToken", token, cookieOptions);

                                return Ok(Json(token));
                            }
                            else return NotFound("Password is incorrect!");
                            
                        }
                        else
                        {

                            return NotFound("User with given credentials does not exist!");
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
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(token);

        }
    }
}
