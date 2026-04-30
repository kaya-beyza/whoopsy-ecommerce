using System.Net;
using System.Text.Json;
using FluentValidation;  // 👈 YENİ: ValidationException için

namespace MiniETicaret.API.Middlewares;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context); // Bir sonraki middleware'e veya controller'a geç
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        // Switch ile her istisna türü için doğru status kodu + mesaj hazırlıyoruz
        object response;

        switch (exception)
        {
            // 1) FluentValidation hataları → 400 Bad Request, her alan için ayrı mesaj
            case ValidationException validationEx:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                response = new
                {
                    StatusCode = context.Response.StatusCode,
                    Message = "Doğrulama hatası. Lütfen alanları kontrol edin.",
                    Errors = validationEx.Errors.Select(e => new
                    {
                        Field = e.PropertyName,   // Örn: "Email"
                        Error = e.ErrorMessage    // Örn: "Geçerli bir email adresi giriniz."
                    })
                };
                break;

            // 2) "Bu email zaten kullanılıyor" gibi iş kuralı hataları → 400 Bad Request
            case InvalidOperationException:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                response = new
                {
                    StatusCode = context.Response.StatusCode,
                    Message = exception.Message
                };
                break;

            // 3) Kayıt bulunamadı → 404 Not Found
            case KeyNotFoundException:
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                response = new
                {
                    StatusCode = context.Response.StatusCode,
                    Message = exception.Message
                };
                break;

            // 4) Yetkisiz erişim → 401 Unauthorized
            case UnauthorizedAccessException:
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                response = new
                {
                    StatusCode = context.Response.StatusCode,
                    Message = exception.Message
                };
                break;

            // 5) Bilinmeyen hata → 500 Internal Server Error
            default:
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                response = new
                {
                    StatusCode = context.Response.StatusCode,
                    Message = exception.Message
                };
                break;
        }

        var json = JsonSerializer.Serialize(response);
        await context.Response.WriteAsync(json);
    }
}