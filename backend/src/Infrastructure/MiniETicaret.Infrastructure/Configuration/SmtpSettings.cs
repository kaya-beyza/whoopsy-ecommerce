namespace MiniETicaret.Infrastructure.Configuration;

// SMTP bağlantı ayarları — appsettings.json + .env karışımı ile dolar.
// Public bilgi (Host, Port, FromName): appsettings.json'da.
// Secret (Username, Password, FromEmail): .env'de.
public class SmtpSettings
{
    public string Host { get; set; } = string.Empty;
    public int Port { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FromEmail { get; set; } = string.Empty;
    public string FromName { get; set; } = string.Empty;

    // Test/dev redirect — boş değilse TÜM mailler bu adrese gider.
    // Production'da boş kalmalı.
    public string OverrideRecipient { get; set; } = string.Empty;
}
