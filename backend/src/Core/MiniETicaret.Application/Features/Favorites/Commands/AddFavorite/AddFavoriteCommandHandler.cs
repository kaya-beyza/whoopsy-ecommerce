using MediatR;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;

namespace MiniETicaret.Application.Features.Favorites.Commands.AddFavorite;

public class AddFavoriteCommandHandler : IRequestHandler<AddFavoriteCommand, Guid>
{
    private readonly IFavoriteRepository _favoriteRepository;
    private readonly IUnitOfWork _unitOfWork;

    public AddFavoriteCommandHandler(IFavoriteRepository favoriteRepository, IUnitOfWork unitOfWork)
    {
        _favoriteRepository = favoriteRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(AddFavoriteCommand request, CancellationToken cancellationToken)
    {
        // 1) Aynı favori zaten var mı kontrol et
        var existing = await _favoriteRepository.GetAsync(request.UserId, request.ProductId);
        if (existing != null)
            throw new Exception("Bu ürün zaten favorilerinizde.");

        // 2) Yeni favori oluştur
        var favorite = new Favorite
        {
            UserId = request.UserId,
            ProductId = request.ProductId,
            CreatedDate = DateTime.UtcNow.AddHours(3)
        };

        // 3) Veritabanına kaydet
        await _favoriteRepository.AddAsync(favorite);
        await _unitOfWork.SaveChangesAsync();

        return favorite.Id;
    }
}