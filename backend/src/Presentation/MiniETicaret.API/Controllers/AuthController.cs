using MediatR;
using Microsoft.AspNetCore.Mvc;
using MiniETicaret.Application.Features.Auth.Commands.Login;
using MiniETicaret.Application.Features.Auth.Commands.Register;
using MiniETicaret.Application.Features.Auth.Commands.RefreshToken;

namespace MiniETicaret.API.Controllers;

[ApiController] //"Ben bir API controller'ıyım" (otomatik model validation gibi özellikler aktif olur)
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}