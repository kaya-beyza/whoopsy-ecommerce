using MediatR;
using Microsoft.AspNetCore.Mvc;
using MiniETicaret.Application.Features.Cart.Commands.AddToCart;
using MiniETicaret.Application.Features.Cart.Commands.RemoveFromCart;
using MiniETicaret.Application.Features.Cart.Commands.UpdateCartItem;
using MiniETicaret.Application.Features.Cart.Commands.ClearCart;
using MiniETicaret.Application.Features.Cart.Queries.GetUserCart;

namespace MiniETicaret.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly IMediator _mediator;

    public CartController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET api/cart/{userId}
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserCart(Guid userId)
    {
        var query = new GetUserCartQuery { UserId = userId };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    // POST api/cart
    [HttpPost]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartCommand command)
    {
        var cartItemId = await _mediator.Send(command);
        return Ok(cartItemId);
    }

    // PUT api/cart
    [HttpPut]
    public async Task<IActionResult> UpdateCartItem([FromBody] UpdateCartItemCommand command)
    {
        await _mediator.Send(command);
        return NoContent();
    }

    // DELETE api/cart
    [HttpDelete]
    public async Task<IActionResult> RemoveFromCart([FromBody] RemoveFromCartCommand command)
    {
        await _mediator.Send(command);
        return NoContent();
    }

    // DELETE api/cart/{userId}/clear
    [HttpDelete("{userId}/clear")]
    public async Task<IActionResult> ClearCart(Guid userId)
    {
        var command = new ClearCartCommand { UserId = userId };
        await _mediator.Send(command);
        return NoContent();
    }
}