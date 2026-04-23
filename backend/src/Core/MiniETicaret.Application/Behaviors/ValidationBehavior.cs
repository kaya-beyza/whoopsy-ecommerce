using FluentValidation;
using MediatR;

namespace MiniETicaret.Application.Behaviors;

// TRequest = herhangi bir Command veya Query (örn: RegisterCommand)
// TResponse = o Command'ın döndüğü şey (örn: Guid)
// IPipelineBehavior = MediatR'ın "ara katman ol" arayüzü
public class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    // Bu Command için yazılmış TÜM validator'ları DI bize getirecek
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    // MediatR her Command geldiğinde bu Handle metodunu otomatik çağıracak
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        // Bu Command için hiç validator yoksa → direkt handler'a geç, karışma
        if (!_validators.Any())
            return await next();

        // Validator'a "şunu kontrol et" diyeceğimiz bağlam nesnesi
        var context = new ValidationContext<TRequest>(request);

        // Tüm validator'ları paralel çalıştır, hataları topla
        var failures = (await Task.WhenAll(
                _validators.Select(v => v.ValidateAsync(context, cancellationToken))))
            .SelectMany(r => r.Errors)
            .Where(f => f is not null)
            .ToList();

        // Hata varsa → handler'a HİÇ gitme, istisna fırlat
        if (failures.Count != 0)
            throw new ValidationException(failures);

        // Hata yok → "geç bakalım" deyip handler'a gönder
        return await next();
    }
}