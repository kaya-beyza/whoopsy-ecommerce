using MediatR;
using Microsoft.AspNetCore.Mvc;
using MiniETicaret.Application.Features.Payments.Commands.CreatePayment;

namespace MiniETicaret.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PaymentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // POST api/payments
    [HttpPost]
    public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentCommand command)
    {
        var result = await _mediator.Send(command);

        if (result.Status == Domain.Enums.PaymentStatus.Failed)
            return BadRequest(result);

        return Ok(result);
    }
}