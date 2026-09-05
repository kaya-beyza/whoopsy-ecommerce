using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MiniETicaret.Infrastructure;
using MiniETicaret.Persistence;
using MiniETicaret.Persistence.Context;
using MiniETicaret.Persistence.Seeds;
using MiniETicaret.API.Middlewares;
using MiniETicaret.Application;
using System.Security.Claims;

DotNetEnv.Env.TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);

// Service Registrations
/*Yazdığımız ServiceRegistration'ları çağırıyoruz. "DbContext'i kur, Repository'leri kaydet,
 TokenService'i kaydet" — hepsi bu iki satırla aktif oluyor*/
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;
builder.Services.AddPersistenceServices(connectionString);
builder.Services.AddInfrastructureServices(builder.Configuration);

builder.Services.AddApplicationServices();

// JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]!)),

        NameClaimType = ClaimTypes.NameIdentifier
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("JWT ERROR: " + context.Exception.Message);
            return Task.CompletedTask;
        },

        OnChallenge = context =>
        {
            Console.WriteLine("JWT CHALLENGE ERROR");
            return Task.CompletedTask;
        },

        OnTokenValidated = context =>
        {
            Console.WriteLine("TOKEN VALIDATED");
            return Task.CompletedTask;
        }
    };
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins( 
            "http://localhost:4200", // Angular
                "http://10.0.2.2:5277",  // Android emulator
                "http://localhost:5277"
            )  // Angular'ın çalıştığı adres
              .AllowAnyHeader()                       // Her türlü header'a izin ver
              .AllowAnyMethod()                       // GET, POST, PUT, DELETE hepsine izin ver
              .AllowCredentials();                    // Cookie/token göndermeye izin ver
    });
});

builder.Services.AddAuthorization();
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        // Enum'ları sayı yerine isim olarak serialize et: status=1 → status="Success"
        // Hem input'ta string ("Male") hem sayı (0) kabul edilir, output her zaman string.
        opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

var app = builder.Build();


// Seed Data
/*Uygulama başlarken SeedData'yı çalıştır. İlk seferde Admin/User rolleri eklenir,
 sonraki seferlerde atlanır.*/
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<MiniETicaretDbContext>();
    var bootstrapEmail = builder.Configuration["BootstrapAdmin:Email"];
    var bootstrapPassword = builder.Configuration["BootstrapAdmin:Password"];
    await SeedData.SeedAsync(context, bootstrapEmail, bootstrapPassword);
    //await ProductSeedData.SeedAsync(context);
    //await SubCategorySeedData.SeedAsync(context);
}

// Middleware Pipelinem 
app.UseMiddleware<ExceptionMiddleware>();

app.MapOpenApi();
app.UseSwagger();
app.UseSwaggerUI();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();

// Test projesi Program sınıfına erişebilsin diye
public partial class Program { }