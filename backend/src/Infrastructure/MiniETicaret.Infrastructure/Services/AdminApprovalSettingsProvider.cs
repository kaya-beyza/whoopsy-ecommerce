using Microsoft.Extensions.Options;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Infrastructure.Configuration;

namespace MiniETicaret.Infrastructure.Services;

// IAdminApprovalSettings'in concrete implementation'ı.
// IOptions ile bağlanan POCO sınıfını Application katmanı için interface'e map'ler.
public class AdminApprovalSettingsProvider : IAdminApprovalSettings
{
    private readonly AdminApprovalSettings _settings;

    public AdminApprovalSettingsProvider(IOptions<AdminApprovalSettings> options)
    {
        _settings = options.Value;
    }

    public string GatePassword => _settings.GatePassword;
    public string NotificationEmail => _settings.NotificationEmail;
    public string ApiBaseUrl => _settings.ApiBaseUrl;
}
