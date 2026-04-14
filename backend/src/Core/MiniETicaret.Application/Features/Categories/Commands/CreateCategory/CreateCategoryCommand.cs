using MediatR;

namespace MiniETicaret.Application.Features.Categories.Commands.CreateCategory;

public record CreateCategoryCommand
(
    string Name,
    string? Description,
    Guid? ParentId
) : IRequest<Guid>;