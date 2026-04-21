using MediatR;

namespace MiniETicaret.Application.Features.Favorites.Commands.AddFavorite;

public class AddFavoriteCommand : IRequest<Guid>
{
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
}