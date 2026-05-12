using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using MiniETicaret.API.Middlewares;

namespace MiniETicaret.UnitTests.Middlewares;

public class ExceptionMiddlewareTests
{
    // ══════════════════════════════════════════
    // TEST 1: UnauthorizedAccessException → 401
    // ══════════════════════════════════════════
    [Fact]
    public async Task InvokeAsync_UnauthorizedAccess_Returns401()
    {
        // ARRANGE
        // Sahte bir "sonraki middleware" oluşturuyoruz — her zaman hata fırlatan
        var middleware = new ExceptionMiddleware(
            next: (HttpContext ctx) => throw new UnauthorizedAccessException("Yetkisiz erişim")
        );

        // Sahte HTTP context — gerçek bir HTTP isteği simüle ediyor
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        // ACT
        await middleware.InvokeAsync(context);

        // ASSERT
        Assert.Equal((int)HttpStatusCode.Unauthorized, context.Response.StatusCode);  // 401

        // Response body'yi oku ve mesajı kontrol et
        context.Response.Body.Seek(0, SeekOrigin.Begin);
        var json = await new StreamReader(context.Response.Body).ReadToEndAsync();
        var response = JsonSerializer.Deserialize<JsonElement>(json);
        Assert.Equal("Yetkisiz erişim", response.GetProperty("message").GetString());
    }

    // ══════════════════════════════════════════
    // TEST 2: KeyNotFoundException → 404
    // ══════════════════════════════════════════
    [Fact]
    public async Task InvokeAsync_KeyNotFound_Returns404()
    {
        // ARRANGE
        var middleware = new ExceptionMiddleware(
            next: (HttpContext ctx) => throw new KeyNotFoundException("Kayıt bulunamadı")
        );

        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        // ACT
        await middleware.InvokeAsync(context);

        // ASSERT
        Assert.Equal((int)HttpStatusCode.NotFound, context.Response.StatusCode);  // 404

        context.Response.Body.Seek(0, SeekOrigin.Begin);
        var json = await new StreamReader(context.Response.Body).ReadToEndAsync();
        var response = JsonSerializer.Deserialize<JsonElement>(json);
        Assert.Equal("Kayıt bulunamadı", response.GetProperty("message").GetString());
    }

    // ══════════════════════════════════════════
    // TEST 3: Genel Exception → 500
    // ══════════════════════════════════════════
    [Fact]
    public async Task InvokeAsync_GeneralException_Returns500()
    {
        // ARRANGE
        var middleware = new ExceptionMiddleware(
            next: (HttpContext ctx) => throw new Exception("Beklenmeyen hata")
        );

        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        // ACT
        await middleware.InvokeAsync(context);

        // ASSERT
        Assert.Equal((int)HttpStatusCode.InternalServerError, context.Response.StatusCode);  // 500

        context.Response.Body.Seek(0, SeekOrigin.Begin);
        var json = await new StreamReader(context.Response.Body).ReadToEndAsync();
        var response = JsonSerializer.Deserialize<JsonElement>(json);
        Assert.Equal("Beklenmeyen hata", response.GetProperty("message").GetString());
    }

    // ══════════════════════════════════════════
    // TEST 4: Hata yoksa — middleware dokunmadan geçirmeli
    // ══════════════════════════════════════════
    [Fact]
    public async Task InvokeAsync_NoException_PassesThrough()
    {
        // ARRANGE — hata fırlatmayan bir sonraki middleware
        var middleware = new ExceptionMiddleware(
            next: (HttpContext ctx) => Task.CompletedTask
        );

        var context = new DefaultHttpContext();

        // ACT
        await middleware.InvokeAsync(context);

        // ASSERT — status code varsayılan 200 kalmalı
        Assert.Equal((int)HttpStatusCode.OK, context.Response.StatusCode);
    }
}