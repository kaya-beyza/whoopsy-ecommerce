using MediatR;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.Application.Features.Products.Commands.DeleteProductImage;

public class DeleteProductImageCommandHandler : IRequestHandler<DeleteProductImageCommand, bool>
{
    private readonly IProductRepository _productRepository;
    private readonly IFileService _fileService;

    public DeleteProductImageCommandHandler(
        IProductRepository productRepository,
        IFileService fileService)
    {
        _productRepository = productRepository;
        _fileService = fileService;
    }

    public async Task<bool> Handle(
        DeleteProductImageCommand request, CancellationToken cancellationToken)
    {
        // 1. Ürünün görsellerini getir
        var images = await _productRepository.GetImagesByProductIdAsync(
            request.ProductId, cancellationToken);

        // 2. Silinecek görseli bul
        var image = images.FirstOrDefault(i => i.Id == request.ImageId);
        if (image == null)
            return false;

        // 3. Cloudinary'den sil
        await _fileService.DeleteImageAsync(image.PublicId);

        // 4. Veritabanından sil
        await _productRepository.DeleteImageAsync(
            request.ProductId, request.ImageId, cancellationToken);

        return true;
    }
}