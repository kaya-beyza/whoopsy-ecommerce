using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MiniETicaret.Infrastructure;
using MiniETicaret.Persistence;
using MiniETicaret.Persistence.Context;
using MiniETicaret.Persistence.Seeds;
using MiniETicaret.API.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// Service Registrations
/*Yazdığımız ServiceRegistration'ları çağırıyoruz. "DbContext'i kur, Repository'leri kaydet,
 TokenService'i kaydet" — hepsi bu iki satırla aktif oluyor*/
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;
builder.Services.AddPersistenceServices(connectionString);
builder.Services.AddInfrastructureServices();

// MediatR
/*"Application katmanındaki tüm Command/Query Handler'ları otomatik bul ve kaydet." Bu sayede 
LoginCommandHandler, GetUsersQueryHandler vs. hepsi otomatir*/
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(MiniETicaret.Application.Interfaces.IUnitOfWork).Assembly));

// JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    /*Kullanıcı her istekte token gönderecek. Bu ayarlar "token'ı nasıl kontrol edeceğim" diyor.
     4 şeyi doğruluyor — hepsi geçerse istek kabul edilir.*/
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]!))
    };
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200")  // Angular'ın çalıştığı adres
              .AllowAnyHeader()                       // Her türlü header'a izin ver
              .AllowAnyMethod()                       // GET, POST, PUT, DELETE hepsine izin ver
              .AllowCredentials();                    // Cookie/token göndermeye izin ver
    });
});

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Seed Data
/*Uygulama başlarken SeedData'yı çalıştır. İlk seferde Admin/User rolleri eklenir,
 sonraki seferlerde atlanır.*/
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<MiniETicaretDbContext>();
    await SeedData.SeedAsync(context);
}

// Middleware Pipelinem 
app.UseMiddleware<ExceptionMiddleware>();
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowFrontend"); // yukarıda tanımladığımız kuralı aktif eder frontendden gelen istekleri onaylar
app.UseHttpsRedirection();
app.UseAuthentication(); // Önce: "Kim bu kullanıcı?"
app.UseAuthorization(); // Sonra: "Bu kullanıcının yetkisi var mı?"
app.MapControllers(); // Son: Controller'lara yönlendir

app.Run();

// Test projesi Program sınıfına erişebilsin diye
public partial class Program { }