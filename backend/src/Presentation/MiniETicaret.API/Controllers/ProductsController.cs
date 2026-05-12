using MediatR;
using Microsoft.AspNetCore.Mvc;
using MiniETicaret.Domain.Enums;
using MiniETicaret.Application.Features.Products.Commands.CreateProduct;
using MiniETicaret.Application.Features.Products.Commands.DeleteProduct;
using MiniETicaret.Application.Features.Products.Commands.UpdateProduct;
using MiniETicaret.Application.Features.Products.Queries.GetProducts;
using MiniETicaret.Application.Features.Products.Queries.GetProductById;
using MiniETicaret.Application.Features.Products.Queries.GetProductsByCategory;
using MiniETicaret.Application.Features.Products.Commands.UploadProductImage;
using MiniETicaret.Application.Features.Products.Commands.SetMainProductImage;
using MiniETicaret.Application.Features.Products.Commands.DeleteProductImage;
using MiniETicaret.Application.Features.Products.Queries.GetProductsByGender;
using MiniETicaret.Application.Features.Products.Queries.GetProductsByBrand;
using MiniETicaret.Application.Features.Products.Queries.GetProductsByFilter;

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
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 21)
    {
        var result = await _mediator.Send(new GetProductsQuery(page, pageSize));
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
    public async Task<IActionResult> GetByCategory(Guid categoryId, [FromQuery] int page = 1, [FromQuery] int pageSize = 21)
    {
        var result = await _mediator.Send(new GetProductsByCategoryQuery(categoryId, page, pageSize));
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProductCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpGet("filter")]
    public async Task<IActionResult> GetByFilter(
        [FromQuery] List<string>? genders,
        [FromQuery] List<string>? brands,
        [FromQuery] List<string>? categoryIds,
        [FromQuery] string? searchTerm,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 21)
    {
        // Pusuya karşı korunaklı ayrıştırma (Robust Parsing) 🛡️
        var genderList = genders?.Select(g => int.TryParse(g, out var val) ? (Gender)val : (Gender?)null).Where(g => g != null).Select(g => g.Value).ToList();
        var brandList = brands?.Select(b => Enum.TryParse<Brand>(b, true, out var val) ? val : (Brand?)null).Where(b => b != null).Select(b => b.Value).ToList();
        var categoryIdList = categoryIds?.Select(c => Guid.TryParse(c, out var val) ? val : (Guid?)null).Where(c => c != null).Select(c => c.Value).ToList();

        var result = await _mediator.Send(new GetProductsByFilterQuery(genderList, brandList, categoryIdList, searchTerm, minPrice, maxPrice, page, pageSize));
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

    [HttpGet("by-gender")]
    public async Task<IActionResult> GetByGender([FromQuery] Gender? gender, [FromQuery] Guid? categoryId, [FromQuery] int page = 1, [FromQuery] int pageSize = 21)
    {
        var result = await _mediator.Send(new GetProductsByGenderQuery(gender, categoryId, page, pageSize));
        return Ok(result);
    }   
    
    [HttpGet("by-brand")]
    public async Task<IActionResult> GetByBrand([FromQuery] Brand brand, [FromQuery] int page = 1, [FromQuery] int pageSize = 21)
    {
        var result = await _mediator.Send(new GetProductsByBrandQuery(brand, page, pageSize));
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
