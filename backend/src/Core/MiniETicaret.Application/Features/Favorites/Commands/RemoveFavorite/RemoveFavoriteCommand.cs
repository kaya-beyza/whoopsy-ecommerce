using MediatR;

namespace MiniETicaret.Application.Features.Favorites.Commands.RemoveFavorite;

public class RemoveFavoriteCommand : IRequest<Unit>
{
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
}