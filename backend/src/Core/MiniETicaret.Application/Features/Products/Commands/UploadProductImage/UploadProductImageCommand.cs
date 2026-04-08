using MediatR;
  using MiniETicaret.Application.Features.Products.DTOs;

  namespace MiniETicaret.Application.Features.Products.Commands.UploadProductImage;

  public record UploadProductImageCommand(
      Guid ProductId,
      Stream FileStream,
      string FileName,
      bool IsMain = false
  ) : IRequest<ProductImageDto>;