using MediatR;
using MiniETicaret.Application.Features.Products.DTOs;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;

namespace MiniETicaret.Application.Features.Products.Commands.UploadProductImage;

public class UploadProductImageCommandHandler : IRequestHandler<UploadProductImageCommand, ProductImageDto>
{
    private readonly IProductRepository _productRepository;
    private readonly IFileService _fileService;

    public UploadProductImageCommandHandler(
        IProductRepository productRepository,
        IFileService fileService)
    {
        _productRepository = productRepository;
        _fileService = fileService;
    }

    public async Task<ProductImageDto> Handle(
        UploadProductImageCommand request, CancellationToken cancellationToken)
    {
        // 1. Ürün var mı kontrol et
        var product = await _productRepository.GetByIdAsync(request.ProductId, cancellationToken);
        if (product == null)
            throw new Exception($"Ürün bulunamadı: {request.ProductId}");

        // 2. Görseli Cloudinary'ye yükle
        var uploadResult = await _fileService.UploadImageAsync(
            request.FileStream,
            request.FileName,
            $"products/{request.ProductId}"
        );

        // 3. Mevcut görsel sayısını al (DisplayOrder için)
        var existingImages = await _productRepository.GetImagesByProductIdAsync(
            request.ProductId, cancellationToken);

        // 4. ProductImage entity oluştur
        var image = new ProductImage
        {
            PublicId = uploadResult.PublicId,
            Url = uploadResult.Url,
            IsMain = request.IsMain || existingImages.Count == 0,
            DisplayOrder = existingImages.Count
        };

        // 5. Veritabanına kaydet
        var savedImage = await _productRepository.AddImageAsync(
            request.ProductId, image, cancellationToken);

        // 6. DTO olarak dön
        return new ProductImageDto
        {
            Id = savedImage.Id,
            PublicId = savedImage.PublicId,
            Url = savedImage.Url,
            IsMain = savedImage.IsMain,
            DisplayOrder = savedImage.DisplayOrder
        };
    }
}