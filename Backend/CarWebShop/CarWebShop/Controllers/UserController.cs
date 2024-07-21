using CarWebShop.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace CarWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly UserUtility _userUtility;
        private readonly IConfiguration _configuration;
        public UserController(UserUtility userUtility, IConfiguration configuration)
        {
            _userUtility = userUtility;
            _configuration = configuration;
        }
        [HttpPut("UpdateNewMessages")]
        public IActionResult UpdateNewMessages(string username, int step)
        {
           
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string query = "UPDATE Users SET NewMessages = NewMessages - @Step WHERE UserName = @UserName";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@UserName", username);
                    command.Parameters.AddWithValue("@Step", step);
                    int updateRowsAffected = command.ExecuteNonQuery();
                    if (updateRowsAffected > 0)
                    {
                        return Ok();
                    }
                    else return BadRequest();
                }
            }
        }
        [HttpGet("GetNewMessages")]
        public IActionResult GetNewMessages(string username)
        {
            int? newMessages = _userUtility.GetNewMessages(username);
            if(newMessages.HasValue)
            {
                return Ok(newMessages.Value);
            }
            else
            {
                return BadRequest();
            }
        } 
        [HttpGet("GetID")]
        public IActionResult GetUserID(string username)
        {
            int? UserID = _userUtility.GetUserIdByUsername(username);

            if (UserID.HasValue)
            {
                return Ok(UserID.Value); 
            }
            else
            {
                return NotFound("User not found");
            }
        }
    }
}
