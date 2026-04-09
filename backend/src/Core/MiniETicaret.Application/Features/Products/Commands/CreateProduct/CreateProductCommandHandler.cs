using MediatR;
using MiniETicaret.Domain.Entities;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.Application.Features.Products.Commands.CreateProduct;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Guid>
{
    private readonly IProductRepository _productRepository;

    public CreateProductCommandHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            StockQuantity = request.StockQuantity,
            CategoryId = request.CategoryId,
            IsActive = true,
            CreatedDate = DateTime.UtcNow.AddHours(3),
            Gender = request.Gender,
        };

        await _productRepository.AddAsync(product, cancellationToken);
        return product.Id;
    }


}