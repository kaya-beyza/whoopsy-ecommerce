using MediatR;
using MiniETicaret.Application.Features.Categories.DTOs;

namespace MiniETicaret.Application.Features.Categories.Queries.GetCategoryTree;

public record GetCategoryTreeQuery : IRequest<List<CategoryDto>>;