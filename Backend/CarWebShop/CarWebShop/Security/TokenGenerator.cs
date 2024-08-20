using CarWebShop.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace CarWebShop.Security
{
    
    public class TokenGenerator
    {
        private readonly PasswordEncoder _passwordEncoder;
        private readonly IConfiguration _configuration;
        public TokenGenerator(IConfiguration configuration, PasswordEncoder password)
        {
            _configuration = configuration;
            _passwordEncoder = password;
        }
        public string Generate(string username)
        {
            var securutyKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securutyKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                 new Claim(ClaimTypes.NameIdentifier, username)


             };
            var token = new JwtSecurityToken(_configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(token);

        }
    }
}
