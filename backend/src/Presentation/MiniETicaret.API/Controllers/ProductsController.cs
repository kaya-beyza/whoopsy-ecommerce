using MediatR;
using Microsoft.AspNetCore.Mvc;
using MiniETicaret.Application.Features.Products.Commands.CreateProduct;
using MiniETicaret.Application.Features.Products.Commands.DeleteProduct;
using MiniETicaret.Application.Features.Products.Commands.UpdateProduct;
using MiniETicaret.Application.Features.Products.Queries.GetProducts;
using MiniETicaret.Application.Features.Products.Queries.GetProductById;

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
        if(result == null)
            return NotFound();

        return Ok(result);    
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProductCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id,UpdateProductCommand command)
    {
        var result = await _mediator.Send(command with {Id = id});   // urlden gelen idyi commanddaki idye atıyoruz ki handlerda kullanabilelimm                                         
        if(result == false)
            return NotFound();

        return Ok(result);    
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteProductCommand(id));
        if(result == false)
            return NotFound();

        return Ok(result);    
            
    }
}
