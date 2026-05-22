using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Infrastructure.Configuration;
using MiniETicaret.Infrastructure.Services;
namespace MiniETicaret.Infrastructure;


public static class ServiceRegistration
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {   // "Birisi ITokenService isterse, ona TokenService ver."
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IFileService, FileService>();
        services.AddScoped<IPaymentService, IyzicoPaymentService>();

        // SmtpSettings'i appsettings.json'daki "Smtp" bölümüne bağla.
        // .env'deki Smtp__Username gibi değerler de buraya merge olur (ASP.NET config sistemi __ → : çevirir).
        services.Configure<SmtpSettings>(configuration.GetSection("Smtp"));
        services.AddScoped<IEmailService, SmtpEmailService>();

        // Admin Approval Flow ayarları (gate password, notification email, api base url).
        services.Configure<AdminApprovalSettings>(configuration.GetSection("AdminApproval"));
        services.AddScoped<IAdminApprovalSettings, AdminApprovalSettingsProvider>();

        return services;
    }
}