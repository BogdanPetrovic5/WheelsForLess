


using CarWebShop.Interfaces;
using CarWebShop.Models;
using Microsoft.AspNetCore.Mvc;

namespace CarWebShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarController : Controller
    {
        private readonly ICarRepository _carRepository;
        public CarController(ICarRepository carRepository)
        {
            _carRepository = carRepository;
        }
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Car>))]

        public ActionResult<IEnumerable<Car>> GetCars()
        {
            var Cars = _carRepository.GetCars();
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            return Ok(Cars);
        }
    }
}
