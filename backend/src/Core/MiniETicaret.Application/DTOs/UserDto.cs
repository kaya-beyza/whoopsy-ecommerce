namespace MiniETicaret.Application.DTOs;
using MiniETicaret.Domain.Enums;
public class UserDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public UserGender? Gender { get; set; }
    public DateTime? BirthDate { get; set; }
}