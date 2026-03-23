using MediatR;

namespace MiniETicaret.Application.Features.Products.Commands.DeleteProduct;

public record DeleteProductCommand(Guid Id) : IRequest<bool>;
                // bool sonradan eklendi true veya false döndürmesi için.
                // Unit de kullanılıyormuş hiçbir şey döndürmemesi için
                // daha sonra tekrardan gözden geçirilebilir.