using MediatR;
using MiniETicaret.Application.DTOs;

namespace MiniETicaret.Application.Features.Favorites.Queries.GetUserFavorites;

public class GetUserFavoritesQuery : IRequest<List<FavoriteDto>>
{
    public Guid UserId { get; set; }
}