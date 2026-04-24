using MediatR;
using MiniETicaret.Application.DTOs;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.Application.Features.Favorites.Queries.GetUserFavorites;

public class GetUserFavoritesQueryHandler : IRequestHandler<GetUserFavoritesQuery, List<FavoriteDto>>
{
    private readonly IFavoriteRepository _favoriteRepository;

    public GetUserFavoritesQueryHandler(IFavoriteRepository favoriteRepository)
    {
        _favoriteRepository = favoriteRepository;
    }

    public async Task<List<FavoriteDto>> Handle(GetUserFavoritesQuery request, CancellationToken cancellationToken)
    {
        // 1) Kullanıcının tüm favorilerini getir (Product bilgisi dahil)
        var favorites = await _favoriteRepository.GetByUserIdAsync(request.UserId);

        // 2) Entity'leri DTO'lara dönüştür
        var favoriteDtos = favorites.Select(f => new FavoriteDto
        {
            ProductId = f.ProductId,
            ProductName = f.Product?.Name ?? string.Empty,
            Price = f.Product?.Price ?? 0,
            MainImageUrl = f.Product?.Images?.FirstOrDefault(i => i.IsMain)?.Url,
            AddedAt = f.CreatedDate
        }).ToList();

        return favoriteDtos;
    }
}