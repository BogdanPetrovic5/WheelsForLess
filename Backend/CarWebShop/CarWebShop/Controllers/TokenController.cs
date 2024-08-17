using CarWebShop.Security;
using Microsoft.AspNetCore.Mvc;

namespace CarWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : Controller
    {
        private readonly TokenGenerator _tokenGenerator;
        public TokenController(TokenGenerator tokenGenerator)
        {
            _tokenGenerator = tokenGenerator;
        }
        [HttpGet("RefreshToken")]
        public IActionResult RefreshToken(string username)
        {
            string refreshedToken = _tokenGenerator.Generate(username);
            return Json(refreshedToken);
        }
    }
}
