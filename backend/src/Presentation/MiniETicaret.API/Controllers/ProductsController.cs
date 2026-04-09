using MediatR;
using Microsoft.AspNetCore.Mvc;
using MiniETicaret.Application.Features.Products.Commands.CreateProduct;
using MiniETicaret.Application.Features.Products.Commands.DeleteProduct;
using MiniETicaret.Application.Features.Products.Commands.UpdateProduct;
using MiniETicaret.Application.Features.Products.Queries.GetProducts;
using MiniETicaret.Application.Features.Products.Queries.GetProductById;
using MiniETicaret.Application.Features.Products.Queries.GetProductsByCategory;
using MiniETicaret.Application.Features.Products.Commands.UploadProductImage;
using MiniETicaret.Application.Features.Products.Commands.SetMainProductImage;
using MiniETicaret.Application.Features.Products.Commands.DeleteProductImage;

namespace MiniETicaret.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetProductsQuery());
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetProductByIdQuery(id));
        if (result == null)
            return NotFound();

        return Ok(result);
    }
    [HttpGet("by-category/{categoryId}")]
    public async Task<IActionResult> GetByCategory(Guid categoryId)
    {
        var result = await _mediator.Send(new GetProductsByCategoryQuery(categoryId));
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProductCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateProductCommand command)
    {
        var result = await _mediator.Send(command with { Id = id });   // urlden gelen idyi commanddaki idye atıyoruz ki handlerda kullanabilelimm                                         
        if (result == false)
            return NotFound();

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteProductCommand(id));
        if (result == false)
            return NotFound();

        return Ok(result);
    }
    [HttpPost("{productId}/images")]
    public async Task<IActionResult> UploadImage(Guid productId, IFormFile file, [FromQuery] bool isMain = false)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Dosya seçilmedi!");

        using var stream = file.OpenReadStream();

        var command = new UploadProductImageCommand(
            ProductId: productId,
            FileStream: stream,
            FileName: file.FileName,
            IsMain: isMain
        );

        var result = await _mediator.Send(command);
        return Ok(result);
    }
    [HttpDelete("{productId}/images/{imageId}")]
    public async Task<IActionResult> DeleteImage(Guid productId, Guid imageId)
    {
        var result = await _mediator.Send(new DeleteProductImageCommand(productId, imageId));
        if (result == false)
            return NotFound("Görsel bulunamadı!");

        return Ok("Görsel başarıyla silindi.");
    }

    [HttpPut("{productId}/images/{imageId}/set-main")]
    public async Task<IActionResult> SetMainImage(Guid productId, Guid imageId)
    {
        var result = await _mediator.Send(new SetMainProductImageCommand(productId, imageId));
        if (result == false)
            return NotFound("Görsel bulunamadı!");

        return Ok("Ana görsel güncellendi.");
    }
}
