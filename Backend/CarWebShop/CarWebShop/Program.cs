using CarWebShop.Data;
using CarWebShop.Interfaces;
using CarWebShop.Repository;
using CarWebShop.Security;
using CarWebShop.Services;
using CarWebShop.Utilities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Net.WebSockets;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddTransient<ICarRepository, CarsRepository>();
builder.Services.AddTransient<IAdverRepository, AdverRepository>();
builder.Services.AddTransient<IMessagesRepository, MessageRepository>();
builder.Services.AddScoped<NotificationService>();
builder.Services.AddScoped<AdverUtility>();
builder.Services.AddScoped<UserUtility>();
builder.Services.AddScoped<PasswordEncoder>();

builder.Services.AddScoped<PasswordHasher<string>>();
builder.Services.AddSingleton<WebSocketConnectionManager>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:4200")
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                    };
                });

var app = builder.Build();




// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors();

app.UseStaticFiles();

app.UseWebSockets();

app.MapControllers();
var webSocketManager = app.Services.GetRequiredService<WebSocketConnectionManager>();


app.Map("/ws", async context =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        WebSocket webSocket = null;
        try
        {
            webSocket = await context.WebSockets.AcceptWebSocketAsync();

            string socketParameter = context.Request.Query["socketParameter"];
            if (string.IsNullOrEmpty(socketParameter))
            {
                context.Response.StatusCode = 400;
                return;
            }
            Console.WriteLine($"WebSocket connected: {socketParameter}");
            webSocketManager.AddSocket(socketParameter, webSocket);

            await HandleWebSocket(webSocket, webSocketManager, socketParameter);
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("WebSocket connection closed by client.");
        }
        catch (WebSocketException ex) when (ex.WebSocketErrorCode == WebSocketError.ConnectionClosedPrematurely)
        {
            Console.WriteLine("WebSocket connection closed prematurely.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WebSocket request failed: {ex.Message}");
        }
    }
    else
    {
        context.Response.StatusCode = 400;
    }
});




app.Run();

 async Task HandleWebSocket(WebSocket webSocket, WebSocketConnectionManager webSocketManager, string socketParameter)
{
    var buffer = new byte[1024 * 4];

    try
    {
        while (webSocket.State == WebSocketState.Open)
        {
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            if (result.MessageType == WebSocketMessageType.Close)
            {
                Console.WriteLine("Received close message from client.");
                break;
            }

            if (webSocket.State == WebSocketState.Open)
            {
                var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                Console.WriteLine($"Received message: {message}");

                
                await webSocket.SendAsync(new ArraySegment<byte>(Encoding.UTF8.GetBytes($"Echo: {message}")), result.MessageType, result.EndOfMessage, CancellationToken.None);
            }
        }
    }
    catch (WebSocketException ex)
    {
        Console.WriteLine($"WebSocket exception: {ex.Message}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Exception: {ex.Message}");
    }
    finally
    {
        if (webSocket.State == WebSocketState.Open || webSocket.State == WebSocketState.CloseReceived)
        {
            try
            {
                Console.WriteLine("Attempting to close WebSocket connection.");
                await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Connection closed", CancellationToken.None);
            }
            catch (WebSocketException ex)
            {
                Console.WriteLine($"WebSocket close exception: {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception during WebSocket close: {ex.Message}");
            }
        }
        else
        {
            Console.WriteLine($"WebSocket already closed or aborted. State: {webSocket.State}");
        }

        webSocketManager.RemoveSocket(socketParameter);
        Console.WriteLine("WebSocket connection closed in HandleWebSocket.");
    }
}



