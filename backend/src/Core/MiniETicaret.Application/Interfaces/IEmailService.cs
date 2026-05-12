namespace MiniETicaret.Application.Interfaces;
// Application katmanı sadece "mail at" der; SMTP/SendGrid/SES detayları Infrastructure'ın işi.
public interface IEmailService
{
    Task SendAsync(string to, string subject, string htmlBody, CancellationToken cancellationToken = default);
}