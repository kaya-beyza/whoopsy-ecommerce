using Microsoft.Extensions.DependencyInjection;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Infrastructure.Services;
namespace MiniETicaret.Infrastructure;


public static class ServiceRegistration
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {   // "Birisi ITokenService isterse, ona TokenService ver."
        services.AddScoped<ITokenService,TokenService>();

        return services;
    }
}