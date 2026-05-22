namespace MiniETicaret.Domain.Enums;

// Admin başvurularının yaşam döngüsü.
// Normal kullanıcılar için her zaman Approved'dur.
// Admin başvuruları Pending'de başlar, onay sonrası Approved veya Rejected olur.
public enum AdminApprovalStatus
{
    Pending = 0,
    Approved = 1,
    Rejected = 2
}
