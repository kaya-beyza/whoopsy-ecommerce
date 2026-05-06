using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MiniETicaret.Application.Features.Auth.Queries.GetUsers;
using MiniETicaret.Application.Features.Auth.Queries.GetUserById;
using MiniETicaret.Application.Features.Auth.Queries.GetUserOrderHistory;
namespace MiniETicaret.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;
    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }
    // GET api/users?page=1&size=10                                                                                                                         
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int size = 10)
    {
        var query = new GetUsersQuery { Page = page, Size = size };
        var result = await _mediator.Send(query);
        return Ok(result);
    }
    
    // GET api/users/me — token sahibi kullanıcının kendi profilini döner
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetMe()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var query = new GetUserByIdQuery { Id = userId };
        var result = await _mediator.Send(query);
        return Ok(result);
    } 

    // GET api/users/3fa85f64-5717-4562-b3fc-2c963f66afa6                                                                                                    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var query = new GetUserByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    // GET api/users/3fa85f64-5717-4562-b3fc-2c963f66afa6/orders
    [HttpGet("{id}/orders")]
    public async Task<IActionResult> GetOrderHistory(Guid id)
    {
        var query = new GetUserOrderHistoryQuery { UserId = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}