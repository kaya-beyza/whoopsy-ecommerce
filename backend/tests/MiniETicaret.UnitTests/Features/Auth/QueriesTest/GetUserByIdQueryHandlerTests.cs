using Moq;
using MiniETicaret.Application.Features.Auth.Queries.GetUserById;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;

namespace MiniETicaret.UnitTests.Features.Auth.Queries;

public class GetUserByIdQueryHandlerTests
{
    private readonly Mock<IUserRepository> _mockUserRepo;
    private readonly GetUserByIdQueryHandler _handler;

    public GetUserByIdQueryHandlerTests()
    {
        _mockUserRepo = new Mock<IUserRepository>();
        _handler = new GetUserByIdQueryHandler(_mockUserRepo.Object);
    }
    // ══════════════════════════════════════════                                                                                                         
    // TEST 1: Kullanıcı bulunamazsa hata fırlat
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_UserNotFound_ThrowsException()
    {
        // ARRANGE — bu ID ile kullanıcı yok
        var fakeId = Guid.NewGuid();

        _mockUserRepo
            .Setup(repo => repo.GetByIdAsync(fakeId))
            .ReturnsAsync((AppUser?)null);

        var query = new GetUserByIdQuery
        {
            Id = fakeId
        };

        // ACT & ASSERT
        await Assert.ThrowsAsync<Exception>(
            () => _handler.Handle(query, CancellationToken.None)
        );
    }
    // ══════════════════════════════════════════                                                                                                         
    // TEST 2: Kullanıcı bulunursa doğru UserDto döner
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_UserFound_ReturnsUserDto()
    {
        // ARRANGE — veritabanında bu kullanıcı var
        var userId = Guid.NewGuid();
        var createdDate = new DateTime(2026, 1, 15);

        var user = new AppUser
        {
            Id = userId,
            FullName = "Ahmet Yılmaz",
            Email = "ahmet@mail.com",
            IsActive = true,
            RoleId = Guid.NewGuid(),
            Role = new Role { Id = Guid.NewGuid(), Name = "Admin" },
            CreatedDate = createdDate
        };

        _mockUserRepo
            .Setup(repo => repo.GetByIdAsync(userId))
            .ReturnsAsync(user);

        var query = new GetUserByIdQuery
        {
            Id = userId
        };

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);

        // ASSERT
        Assert.Equal(userId, result.Id);
        Assert.Equal("Ahmet Yılmaz", result.FullName);
        Assert.Equal("ahmet@mail.com", result.Email);
        Assert.True(result.IsActive);
        Assert.Equal("Admin", result.RoleName);
        Assert.Equal(createdDate, result.CreatedDate);
    }
}