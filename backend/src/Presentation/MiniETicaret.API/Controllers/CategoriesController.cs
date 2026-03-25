using MediatR;
using Microsoft.AspNetCore.Mvc;
using MiniETicaret.Application.Features.Categories.Commands.CreateCategory;
using MiniETicaret.Application.Features.Categories.Commands.UpdateCategory;
using MiniETicaret.Application.Features.Categories.Queries.GetCategories;

namespace MiniETicaret.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CategoriesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetCategoriesQuery());
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCategoryCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id,UpdateCategoryCommand command)
    {
        var result = await _mediator.Send(command with {Id = id});
        if(result == false)
            return NotFound();

        return Ok(result);    
    }


}