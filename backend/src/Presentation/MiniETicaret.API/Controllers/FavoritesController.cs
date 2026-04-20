using MediatR;
using Microsoft.AspNetCore.Mvc;
using MiniETicaret.Application.Features.Favorites.Commands.AddFavorite;
using MiniETicaret.Application.Features.Favorites.Commands.RemoveFavorite;
using MiniETicaret.Application.Features.Favorites.Queries.GetUserFavorites;

namespace MiniETicaret.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FavoritesController : ControllerBase
{
    private readonly IMediator _mediator;

    public FavoritesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET api/favorites/{userId}
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserFavorites(Guid userId)
    {
        var query = new GetUserFavoritesQuery { UserId = userId };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    // POST api/favorites
    [HttpPost]
    public async Task<IActionResult> AddFavorite([FromBody] AddFavoriteCommand command)
    {
        var favoriteId = await _mediator.Send(command);
        return Ok(favoriteId);
    }

    // DELETE api/favorites
    [HttpDelete]
    public async Task<IActionResult> RemoveFavorite([FromBody] RemoveFavoriteCommand command)
    {
        await _mediator.Send(command);
        return NoContent();
    }
}