using MediatR;
  using Microsoft.AspNetCore.Mvc;
  using MiniETicaret.Application.Features.Orders.Commands.CreateOrder;
  using MiniETicaret.Application.Features.Orders.Commands.UpdateOrderStatus;
  using MiniETicaret.Application.Features.Orders.Queries.GetOrders;
  using MiniETicaret.Application.Features.Orders.Queries.GetOrderDetail;
  using MiniETicaret.Domain.Enums;

  namespace MiniETicaret.API.Controllers;

  [ApiController]
  [Route("api/[controller]")]
  public class OrdersController : ControllerBase
  {
      private readonly IMediator _mediator;

      public OrdersController(IMediator mediator)
      {
          _mediator = mediator;
      }

      // GET api/orders?page=1&size=10&status=Pending
      [HttpGet]
      public async Task<IActionResult> GetAll(
          [FromQuery] int page = 1,
          [FromQuery] int size = 10,
          [FromQuery] OrderStatus? status = null)
      {
          var query = new GetOrdersQuery { Page = page, Size = size, Status = status };
          var result = await _mediator.Send(query);
          return Ok(result);
      }

      // GET api/orders/3fa85f64-5717-4562-b3fc-2c963f66afa6
      [HttpGet("{id}")]
      public async Task<IActionResult> GetById(Guid id)
      {
          var query = new GetOrderDetailQuery { OrderId = id };
          var result = await _mediator.Send(query);
          return Ok(result);
      }

      // POST api/orders
      [HttpPost]
      public async Task<IActionResult> Create([FromBody] CreateOrderCommand command)
      {
          var orderId = await _mediator.Send(command);
          return CreatedAtAction(nameof(GetById), new { id = orderId }, orderId);
      }

      // PUT api/orders/3fa85f64-5717-4562-b3fc-2c963f66afa6/status
      [HttpPut("{id}/status")]
      public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateOrderStatusCommand command)
      {
          command.OrderId = id;
          await _mediator.Send(command);
          return NoContent();
      }
  }