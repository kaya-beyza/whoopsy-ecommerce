using MediatR;
using Microsoft.AspNetCore.Mvc;
using MiniETicaret.Application.Features.Auth.Commands.ApproveAdmin;
using MiniETicaret.Application.Features.Auth.Commands.RegisterAdmin;
using MiniETicaret.Application.Features.Auth.Commands.RejectAdmin;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // Admin başvurusu. GatePassword .env'deki AdminApproval__GatePassword ile eşleşmeli.
    [HttpPost("register")]
    public async Task<IActionResult> RegisterAdmin([FromBody] RegisterAdminCommand command)
    {
        var userId = await _mediator.Send(command);
        return Ok(new { userId, message = "Başvurun alındı. Onay sonrası giriş yapabilirsin." });
    }

    // Sadece gate password'ün doğru olup olmadığını kontrol eder (frontend 2 adımlı UI için).
    [HttpPost("verify-gate")]
    public IActionResult VerifyGate([FromBody] VerifyGateRequest request, [FromServices] IAdminApprovalSettings settings)
    {
        if (string.IsNullOrWhiteSpace(settings.GatePassword))
            return StatusCode(500, new { message = "Admin başvuru sistemi yapılandırılmamış." });

        if (!string.Equals(request.GatePassword, settings.GatePassword, StringComparison.Ordinal))
            return Unauthorized(new { message = "Erişim şifresi hatalı." });

        return Ok(new { ok = true });
    }

    // Email'deki "Onayla" linki bu endpoint'i tetikler. HTML sayfa döner — tarayıcıdan tıklanır.
    [HttpGet("approve/{token:guid}")]
    public async Task<IActionResult> Approve(Guid token)
    {
        try
        {
            var name = await _mediator.Send(new ApproveAdminCommand(token));
            return Content(BuildResultPage(
                title: "Başvuru Onaylandı",
                heading: $"✓ {name} onaylandı",
                message: "Kullanıcıya bilgilendirme maili gönderildi. Artık admin olarak giriş yapabilir.",
                accentColor: "#1a8f3b",
                buttonHref: "http://localhost:4200/admin/login",
                buttonLabel: "ADMİN GİRİŞİNE GİT"), "text/html; charset=utf-8");
        }
        catch (InvalidOperationException ex)
        {
            return Content(BuildResultPage(
                title: "İşlem Yapılamadı",
                heading: "✕ İşlem yapılamadı",
                message: ex.Message,
                accentColor: "#b50000",
                buttonHref: "http://localhost:4200",
                buttonLabel: "ANA SAYFAYA DÖN"), "text/html; charset=utf-8");
        }
    }

    [HttpGet("reject/{token:guid}")]
    public async Task<IActionResult> Reject(Guid token)
    {
        try
        {
            var name = await _mediator.Send(new RejectAdminCommand(token));
            return Content(BuildResultPage(
                title: "Başvuru Reddedildi",
                heading: $"✕ {name} reddedildi",
                message: "Başvurucuya bilgilendirme maili gönderildi. Hesap pasif edildi.",
                accentColor: "#b50000",
                buttonHref: "http://localhost:4200",
                buttonLabel: "ANA SAYFAYA DÖN"), "text/html; charset=utf-8");
        }
        catch (InvalidOperationException ex)
        {
            return Content(BuildResultPage(
                title: "İşlem Yapılamadı",
                heading: "✕ İşlem yapılamadı",
                message: ex.Message,
                accentColor: "#b50000",
                buttonHref: "http://localhost:4200",
                buttonLabel: "ANA SAYFAYA DÖN"), "text/html; charset=utf-8");
        }
    }

    public class VerifyGateRequest
    {
        public string GatePassword { get; set; } = string.Empty;
    }

    // Tıklama sonrası tarayıcıda gösterilen basit HTML — frontend'e dönmeye gerek yok.
    private static string BuildResultPage(string title, string heading, string message, string accentColor, string buttonHref, string buttonLabel) => $@"
<!DOCTYPE html>
<html lang=""tr"">
<head>
    <meta charset=""UTF-8"">
    <title>{title} — whoopsy</title>
    <style>
        body {{ margin:0; font-family: Arial, Helvetica, sans-serif; background:#FAF6F0; display:flex; align-items:center; justify-content:center; min-height:100vh; }}
        .card {{ background:#fff; padding:48px 56px; border-radius:12px; box-shadow:0 10px 40px rgba(0,0,0,0.08); max-width:480px; text-align:center; }}
        .logo {{ font-family: 'Arial Black', sans-serif; font-size:36px; font-weight:900; margin-bottom:32px; letter-spacing:1px; }}
        .logo .red {{ color:#e8000d; }}
        h1 {{ color:{accentColor}; font-size:28px; margin:0 0 16px; }}
        p {{ color:#444; font-size:15px; line-height:1.6; }}
        a {{ display:inline-block; margin-top:32px; background:#000; color:#fff; text-decoration:none; padding:14px 36px; border-radius:6px; font-weight:bold; letter-spacing:1px; font-size:14px; }}
    </style>
</head>
<body>
    <div class=""card"">
        <div class=""logo"">wh<span class=""red"">OO</span><span class=""red"">PS</span>y</div>
        <h1>{heading}</h1>
        <p>{message}</p>
        <a href=""{buttonHref}"">{buttonLabel}</a>
    </div>
</body>
</html>";
}
