using MediatR;
using MiniETicaret.Domain.Enums;

namespace MiniETicaret.Application.Features.Products.Commands.CreateProduct;

public record CreateProductCommand
(
    string Name,
    string Description,
    decimal Price,
    int StockQuantity,
    Guid CategoryId,
    Gender Gender,
    Brand Brand
    //bool IsActive her zaman true başlayacağı için burada eklemek gereksiz olacağını düşündüm.
    // eğer ileride sorun olacaksa burayı değiştireceğiz. ayrıca true'yi handlerda set ettim.
): IRequest<Guid>;
