using CarWebShop.Data;
using CarWebShop.Interfaces;
using CarWebShop.Repository;
using CarWebShop.Security;
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
        var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        
        string socketParameter = context.Request.Query["socketParameter"];
        if (string.IsNullOrEmpty(socketParameter))
        {
            context.Response.StatusCode = 400;
            return;
        }
        Console.WriteLine(socketParameter);
        webSocketManager.AddSocket(socketParameter, webSocket);

        await HandleWebSocket(webSocket, webSocketManager, socketParameter);
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
    WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
    while (!result.CloseStatus.HasValue)
    {
        result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
    }

    await webSocketManager.RemoveSocket(socketParameter);
    await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
}
