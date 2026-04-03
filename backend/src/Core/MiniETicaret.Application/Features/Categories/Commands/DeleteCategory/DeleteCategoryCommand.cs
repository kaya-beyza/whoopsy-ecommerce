using MediatR;

namespace MiniETicaret.Application.Features.Categories.Commands.DeleteCategory;

public record DeleteCategoryCommand(Guid Id) : IRequest<bool>;