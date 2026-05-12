using Microsoft.AspNetCore.Mvc;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.API.Controllers;

// GEÇİCİ — SMTP altyapısının çalıştığını doğrulamak için.
// Doğrulama sonrası silinecek; başka yere referans verme.
[ApiController]
[Route("api/[controller]")]
public class EmailTestController : ControllerBase
{
    private readonly IEmailService _email;

    public EmailTestController(IEmailService email)
    {
        _email = email;
    }

    [HttpPost("send")]
    public async Task<IActionResult> Send([FromQuery] string to)
    {
        await _email.SendAsync(
            to,
            "whoopsy SMTP test",
            "<h2>Merhaba 👋</h2><p>Bu bir test mailidir. SMTP entegrasyonu çalışıyor demektir.</p>"
        );
        return Ok(new { message = "SendAsync çağrıldı. Log'a hata düşmediyse mail yola çıktı." });
    }
}