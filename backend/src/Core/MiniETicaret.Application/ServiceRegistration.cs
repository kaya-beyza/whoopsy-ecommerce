using System.Reflection;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using MiniETicaret.Application.Behaviors;

namespace MiniETicaret.Application;

// "static" = Bu sınıftan nesne üretilmez, sadece metot kabı olarak kullanılır
public static class ServiceRegistration
{
    // "this IServiceCollection" = extension method yapan sihirli kısım
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Şu anki dosyanın bulunduğu assembly (Application katmanı)
        var assembly = Assembly.GetExecutingAssembly();

        // 1) MediatR'ı kaydet + bu assembly'deki tüm handler'ları bul
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(assembly);

            // SIRA ÖNEMLİ: Önce kaydedilen DIŞTA çalışır
            // 1) Logging: tüm request'i sarar, süreyi ölçer, hataları yakalar
            cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
            // 2) BEKÇİMİZİ pipeline'a ekle! İşte bu satır her şeyin anahtarı.
            //    Her Command/Query için otomatik çalışacak.
            cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        // 3) Bu assembly'deki TÜM FluentValidation validator'larını otomatik bul ve kaydet
        //    (RegisterCommandValidator, LoginCommandValidator, ...)
        services.AddValidatorsFromAssembly(assembly);

        return services;
    }
}