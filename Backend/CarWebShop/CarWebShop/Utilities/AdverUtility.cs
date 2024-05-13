using CarWebShop.Data;
using CarWebShop.Dto;
using CarWebShop.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace CarWebShop.Utilities
{
    public class AdverUtility
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public AdverUtility(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task createFolder(int adverID, string username, [FromForm] AdverDto adverDto, List<IFormFile> selectedImages)
        {
            string adverFolderName = adverID.ToString();
            string adverFolderPath = Path.Combine("wwwroot/Photos/" + username, adverFolderName);
            Directory.CreateDirectory(adverFolderPath);

            foreach (var formFile in selectedImages)
            {
                if (formFile.Length > 0)
                {
                    string fileName = Path.GetFileName(formFile.FileName);
                    string filePath = Path.Combine(adverFolderPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await formFile.CopyToAsync(stream);
                    }
                    var imagePath = new ImagePaths
                    {
                        AdverID = adverID,
                        ImagePath = Path.Combine(username, adverID.ToString(), fileName)
                    };


                    _context.ImagePaths.Add(imagePath);
                    _context.SaveChanges();
                }
            }



        }

        public bool checkForDuplicates(FavoritesDto favoritesDto, int UserID)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                string query = "SELECT 1 FROM Favorites WHERE AdverID = @AdverID AND UserID = @UserID";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@AdverID", favoritesDto.AdverID);
                    command.Parameters.AddWithValue("UserID", UserID);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            // Row with the specified AdverID and UserID exists
                            return true;
                        }
                        else
                        {
                            //Row doesn't exist
                            return false;
                        }
                    }

                }
            }




        }
    }
}
