using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace CarWebShop.Utilities
{
    public class UserUtility
    {
        private IConfiguration _configuration;
        public UserUtility( IConfiguration configuration) { 
            _configuration = configuration;
        }
        public int GetUserIdByUsername(string username)
        {
            int userId = 0;
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string query = "SELECT UserID FROM Users WHERE UserName = @Username";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Username", username);
                    var result = command.ExecuteScalar();
                    if (result != DBNull.Value)
                    {
                        userId = Convert.ToInt32(result);
                    }
                }

            }
            return userId;
        }
        public int GetNewMessages(string username)
        {
            int newMessages = 0;
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using(SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string query = "SELECT NewMessages from Users WHERE UserName = @Username";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Username", username);
                    var result = command.ExecuteScalar();
                    if(result != DBNull.Value)
                    {
                        newMessages = Convert.ToInt32(result);
                    }
                }
            }
            return newMessages;
        }
        public string GetUsernameById(int userID)
        {
            string username = null;
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string query = "SELECT UserName FROM Users WHERE UserID = @userID";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@userID", userID);
                    var result = command.ExecuteScalar();
                    if (result != null && result != DBNull.Value)
                    {
                        username = result.ToString();
                    }
                }

            }
            return username;
        }
    }
}
