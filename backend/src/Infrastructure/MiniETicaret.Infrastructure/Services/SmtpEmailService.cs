using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Infrastructure.Configuration;

namespace MiniETicaret.Infrastructure.Services;

// Gmail SMTP üzerinden HTML mail gönderir.
// MailKit kullanıyoruz — Microsoft'un kendi SmtpClient'ı deprecated.
public class SmtpEmailService : IEmailService
{
    private readonly SmtpSettings _settings;
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(IOptions<SmtpSettings> settings, ILogger<SmtpEmailService> logger)
    {
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task SendAsync(string to, string subject, string htmlBody, CancellationToken cancellationToken = default)
    {
        // Override aktifse (test/dev) asıl alıcı yerine override adresine gönder.
        var actualRecipient = string.IsNullOrWhiteSpace(_settings.OverrideRecipient)
            ? to
            : _settings.OverrideRecipient;

        var redirected = !string.Equals(actualRecipient, to, StringComparison.OrdinalIgnoreCase);

        // MimeMessage = mail'in zarfı. Kimden/Kime/Konu/İçerik bilgilerini taşır.
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_settings.FromName, _settings.FromEmail));
        message.To.Add(MailboxAddress.Parse(actualRecipient));
        message.Subject = subject;

        // BodyBuilder ile HTML body ekle. Plain-text fallback de eklenir (mail client HTML render edemezse).
        var bodyBuilder = new BodyBuilder { HtmlBody = htmlBody };
        message.Body = bodyBuilder.ToMessageBody();

        // SmtpClient — MailKit'in async destekli versiyonu, System.Net.Mail.SmtpClient değil.
        using var client = new SmtpClient();

        try
        {
            // Gmail port 587 → STARTTLS (önce plain bağlan, sonra TLS'e yükselt).
            // 465 olsaydı SslOnConnect kullanırdık.
            await client.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.StartTls, cancellationToken);
            await client.AuthenticateAsync(_settings.Username, _settings.Password, cancellationToken);
            await client.SendAsync(message, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);

            if (redirected)
            {
                _logger.LogInformation(
                    "Email sent to {ActualRecipient} (REDIRECTED from {IntendedRecipient}) | Subject: {Subject}",
                    actualRecipient, to, subject);
            }
            else
            {
                _logger.LogInformation("Email sent to {To} | Subject: {Subject}", actualRecipient, subject);
            }
        }
        catch (Exception ex)
        {
            // Çağıran taraf zaten fire-and-forget bekliyor — burada da log'la ama re-throw etme.
            // Mail başarısız olsa bile business flow (register, order) bozulmamalı.
            _logger.LogError(ex, "Email send failed | To: {To} | Subject: {Subject}", actualRecipient, subject);
        }
    }
}
