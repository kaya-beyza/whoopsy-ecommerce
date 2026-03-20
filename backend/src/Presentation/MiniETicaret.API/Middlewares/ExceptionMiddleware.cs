using System.Net;
using System.Text.Json;
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
        context.Response.StatusCode = exception switch
        {
            KeyNotFoundException => (int)HttpStatusCode.NotFound,           // 404
            UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized, // 401                                                                     
            _ => (int)HttpStatusCode.InternalServerError                    // 500                                                                      
        };
        var response = new
        {
            StatusCode = context.Response.StatusCode,
            Message = exception.Message
        };
        var json = JsonSerializer.Serialize(response); 
        await context.Response.WriteAsync(json);
    }
}