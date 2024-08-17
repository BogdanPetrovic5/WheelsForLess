using Microsoft.IdentityModel.Tokens;
using System.Net;
using System.Text.Json;

namespace CarWebShop.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);

                
                if (context.Response.StatusCode == 401 && !context.Response.HasStarted)
                {
                    await HandleExceptionAsync(context, HttpStatusCode.Unauthorized, "Not logged in!");
                }
            }
            catch (SecurityTokenExpiredException ex)
            {
                if (!context.Response.HasStarted)
                {
                    await HandleExceptionAsync(context, HttpStatusCode.Unauthorized, "Token Expired!");
                    return;
                }
            }
            catch (SecurityTokenException ex)
            {
                if (!context.Response.HasStarted)
                {
                    await HandleExceptionAsync(context, HttpStatusCode.Unauthorized, "Token Invalid!");
                    return;
                }
            }
            catch (Exception ex)
            {
                if (!context.Response.HasStarted)
                {
                    context.Response.StatusCode = 500;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = ex.Message }));
                    return;
                }
            }
        }
        private static Task HandleExceptionAsync(HttpContext context, HttpStatusCode statusCode, string message)
        {
            var result = JsonSerializer.Serialize(new { error = message });
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;
            return context.Response.WriteAsync(result);
        }
    }
}
