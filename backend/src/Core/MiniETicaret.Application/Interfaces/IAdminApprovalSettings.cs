namespace MiniETicaret.Application.Interfaces;

// Admin başvuru sisteminin .env'den okuyacağı ayarlar.
// Application katmanı IConfiguration bilmesin diye Infrastructure'da implement edilir.
public interface IAdminApprovalSettings
{
    string GatePassword { get; }
    string NotificationEmail { get; }
    string ApiBaseUrl { get; }
}
