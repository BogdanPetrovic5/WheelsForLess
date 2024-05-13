using Microsoft.AspNetCore.Mvc;
using CarWebShop.Data;
namespace CarWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : Controller
    {
        private readonly DataContext _dataContext;
        public MessagesController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        
    }
}
