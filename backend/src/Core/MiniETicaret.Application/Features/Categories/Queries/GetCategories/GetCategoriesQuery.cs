using MediatR;
using MiniETicaret.Application.Features.Categories.DTOs;


namespace MiniETicaret.Application.Features.Categories.Queries.GetCategories;

public record GetCategoriesQuery : IRequest<List<CategoryDto>>;