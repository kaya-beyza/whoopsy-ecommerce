using System.Diagnostics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace MiniETicaret.Application.Behaviors;

// ValidationBehavior ile aynı iskeletle başlıyoruz — generic, IPipelineBehavior
public class LoggingBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        // Command/Query'nin adını alıyoruz: "RegisterCommand", "LoginCommand"...
        var requestName = typeof(TRequest).Name;

        // Kronometre başlat — handler ne kadar sürecek ölçeceğiz
        var stopwatch = Stopwatch.StartNew();

        _logger.LogInformation("▶️   {RequestName} başladı", requestName);

        try
        {
            // Handler'ı çalıştır (ve varsa ondan önceki behavior'ları)
            var response = await next();

            stopwatch.Stop();
            _logger.LogInformation(
                "✅ {RequestName} tamamlandı ({ElapsedMs} ms)",
                requestName,
                stopwatch.ElapsedMilliseconds);

            return response;
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            _logger.LogWarning(
                "❌ {RequestName} HATA verdi ({ElapsedMs} ms) | {Message}",
                requestName,
                stopwatch.ElapsedMilliseconds,
                ex.Message);

            // Hatayı yakaladık, logladık — ama YUTMUYORUZ.
            // ValidationBehavior/ExceptionMiddleware zinciri devam etsin diye yeniden fırlatıyoruz.
            throw;
        }
    }
}