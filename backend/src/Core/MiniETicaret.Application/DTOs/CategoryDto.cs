namespace MiniETicaret.Application.Features.Categories.DTOs;

public class CategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? ParentId { get; set; }
    public string? ParentName { get; set; }
    public int ProductCount { get; set; }
    public List<CategoryDto> SubCategories { get; set; } = new();
}