using MediatR;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.Application.Features.Products.Commands.SetMainProductImage;

public class SetMainProductImageCommandHandler : IRequestHandler<SetMainProductImageCommand, bool>
{
    private readonly IProductRepository _productRepository;

    public SetMainProductImageCommandHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<bool> Handle(
        SetMainProductImageCommand request, CancellationToken cancellationToken)
    {
        return await _productRepository.SetMainImageAsync(
            request.ProductId, request.ImageId, cancellationToken);
    }
}