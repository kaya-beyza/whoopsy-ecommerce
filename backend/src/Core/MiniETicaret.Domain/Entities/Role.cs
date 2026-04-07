using MiniETicaret.Domain.Common;

namespace MiniETicaret.Domain.Entities;

public class Role : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    // Navigation Property
    public ICollection<AppUser> Users { get; set; } = new List<AppUser>();
}