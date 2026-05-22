namespace MiniETicaret.Infrastructure.Configuration;

// .env'deki AdminApproval__ ile eşleşen plain settings sınıfı.
// IOptions<AdminApprovalSettings> üzerinden IAdminApprovalSettings olarak servis edilir.
public class AdminApprovalSettings
{
    public string GatePassword { get; set; } = string.Empty;
    public string NotificationEmail { get; set; } = string.Empty;
    public string ApiBaseUrl { get; set; } = "http://localhost:5277";
}
