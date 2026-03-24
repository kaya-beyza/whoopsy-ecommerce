using System.Reflection.Metadata;
using MediatR;

namespace MiniETicaret.Application.Features.Categories.Commands.UpdateCategory;

public record UpdateCategoryCommand(
    Guid Id,
    string Name,
    string? Description,
    bool IsActive
) : IRequest<bool>;