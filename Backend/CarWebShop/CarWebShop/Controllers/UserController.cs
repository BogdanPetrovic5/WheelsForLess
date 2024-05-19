using CarWebShop.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace CarWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly UserUtility _userUtility;
        public UserController(UserUtility userUtility)
        {
            _userUtility = userUtility;
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
