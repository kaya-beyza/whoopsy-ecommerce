using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Persistence.Context;
using MiniETicaret.Persistence.Repositories;
namespace MiniETicaret.Persistence;

//  Bu dosya çok önemli. Şimdiye kadar yazdığın her şeyi birbirine bağlayan dosya bu.!!!!!
public static class ServiceRegistration
{
    //Static çünkü bir instance oluşturmaya gerek yok. Sadece method'unu çağıracaksın 
    public static IServiceCollection AddPersistenceServices(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<MiniETicaretDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IUserRepository, UserRepository>(); // "Birisi IUserRepository isterse UserRepository ver"
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }

}