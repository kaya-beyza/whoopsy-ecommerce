using MediatR;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.Application.Features.Favorites.Commands.RemoveFavorite;

public class RemoveFavoriteCommandHandler : IRequestHandler<RemoveFavoriteCommand, Unit>
{
    private readonly IFavoriteRepository _favoriteRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RemoveFavoriteCommandHandler(IFavoriteRepository favoriteRepository, IUnitOfWork unitOfWork)
    {
        _favoriteRepository = favoriteRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(RemoveFavoriteCommand request, CancellationToken cancellationToken)
    {
        // 1) Favoriyi bul
        var favorite = await _favoriteRepository.GetAsync(request.UserId, request.ProductId);
        if (favorite == null)
            throw new Exception("Bu ürün favorilerinizde bulunamadı.");

        // 2) Sil ve kaydet
        await _favoriteRepository.RemoveAsync(favorite);
        await _unitOfWork.SaveChangesAsync();

        return Unit.Value;
    }
}