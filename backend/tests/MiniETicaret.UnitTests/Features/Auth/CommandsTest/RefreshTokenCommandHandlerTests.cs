using Moq;
using MiniETicaret.Application.DTOs;
using MiniETicaret.Application.Features.Auth.Commands.RefreshToken;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;

namespace MiniETicaret.UnitTests.Features.Auth.CommandsTest;

public class RefreshTokenCommandHandlerTests
{
    private readonly Mock<IUserRepository> _mockUserRepo;
    private readonly Mock<ITokenService> _mockTokenService;
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly RefreshTokenCommandHandler _handler;

    public RefreshTokenCommandHandlerTests()
    {
        _mockUserRepo = new Mock<IUserRepository>();
        _mockTokenService = new Mock<ITokenService>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();

        _handler = new RefreshTokenCommandHandler(
            _mockUserRepo.Object,
            _mockTokenService.Object,
            _mockUnitOfWork.Object
        );
    }
    // ══════════════════════════════════════════
    // TEST 1: Geçersiz token — kullanıcı bulunamadı
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_InvalidToken_ThrowsUnauthorizedAccessException()
    {
        // ARRANGE — bu token ile eşleşen kullanıcı yok
        _mockUserRepo
            .Setup(repo => repo.GetByRefreshTokenAsync("gecersiz-token"))
            .ReturnsAsync((AppUser?)null);

        var command = new RefreshTokenCommand
        {
            Token = "gecersiz-token"
        };

        // ACT & ASSERT
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => _handler.Handle(command, CancellationToken.None)
        );
    }
    // ══════════════════════════════════════════                                                                                                         
    // TEST 2: Token revoke edilmiş — kullanılamaz
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_TokenIsRevoked_ThrowsUnauthorizedAccessException()
    {
        // ARRANGE — kullanıcı var ama token'ı revoke edilmiş
        var user = new AppUser
        {
            Id = Guid.NewGuid(),
            FullName = "Ahmet Yılmaz",
            Email = "ahmet@mail.com",
            PasswordHash = "hash",
            IsActive = true,
            RoleId = Guid.NewGuid(),
            RefreshTokens = new List<Domain.Entities.RefreshToken>
              {
                  new Domain.Entities.RefreshToken
                  {
                      Token = "revoked-token",
                      ExpiresAt = DateTime.UtcNow.AddDays(7),  // süresi dolmamış
                      IsRevoked = true                          // ← AMA revoke edilmiş!
                  }
              }
        };

        _mockUserRepo
            .Setup(repo => repo.GetByRefreshTokenAsync("revoked-token"))
            .ReturnsAsync(user);

        var command = new RefreshTokenCommand
        {
            Token = "revoked-token"
        };

        // ACT & ASSERT
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => _handler.Handle(command, CancellationToken.None)
        );
    }

    // ══════════════════════════════════════════                                                                                                         
    // TEST 3: Token süresi dolmuş — kullanılamaz
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_TokenIsExpired_ThrowsUnauthorizedAccessException()
    {
        // ARRANGE — kullanıcı var, token revoke değil ama süresi dolmuş
        var user = new AppUser
        {
            Id = Guid.NewGuid(),
            FullName = "Ahmet Yılmaz",
            Email = "ahmet@mail.com",
            PasswordHash = "hash",
            IsActive = true,
            RoleId = Guid.NewGuid(),
            RefreshTokens = new List<Domain.Entities.RefreshToken>
              {
                  new Domain.Entities.RefreshToken
                  {
                      Token = "expired-token",
                      ExpiresAt = DateTime.UtcNow.AddDays(-1),  // ← 1 gün ÖNCE dolmuş!
                      IsRevoked = false                          // revoke değil
                  }
              }
        };

        _mockUserRepo
            .Setup(repo => repo.GetByRefreshTokenAsync("expired-token"))
            .ReturnsAsync(user);

        var command = new RefreshTokenCommand
        {
            Token = "expired-token"
        };

        // ACT & ASSERT
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => _handler.Handle(command, CancellationToken.None)
        );
    }
    // ══════════════════════════════════════════                                                                                                         
    // TEST 4: Geçerli token ile yenileme başarılı
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_ValidToken_ReturnsNewTokenDto()
    {
        // ARRANGE — kullanıcı var, token geçerli
        var user = new AppUser
        {
            Id = Guid.NewGuid(),
            FullName = "Ahmet Yılmaz",
            Email = "ahmet@mail.com",
            PasswordHash = "hash",
            IsActive = true,
            RoleId = Guid.NewGuid(),
            Role = new Role { Id = Guid.NewGuid(), Name = "Admin" },
            RefreshTokens = new List<Domain.Entities.RefreshToken>
              {
                  new Domain.Entities.RefreshToken
                  {
                      Token = "valid-token",
                      ExpiresAt = DateTime.UtcNow.AddDays(7),  // süresi dolmamış
                      IsRevoked = false                          // revoke değil
                  }
              }
        };

        _mockUserRepo
            .Setup(repo => repo.GetByRefreshTokenAsync("valid-token"))
            .ReturnsAsync(user);

        _mockTokenService
            .Setup(ts => ts.GenerateAccessToken(It.IsAny<AppUser>()))
            .Returns("new-access-token");

        _mockTokenService
            .Setup(ts => ts.GenerateRefreshToken())
            .Returns("new-refresh-token");

        _mockUnitOfWork
            .Setup(uow => uow.SaveChangesAsync())
            .ReturnsAsync(1);

        var command = new RefreshTokenCommand
        {
            Token = "valid-token"
        };

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        // 1. Yeni tokenlar doğru mu?
        Assert.Equal("new-access-token", result.AccessToken);
        Assert.Equal("new-refresh-token", result.RefreshToken);

        // 2. Eski token revoke edildi mi?
        Assert.True(user.RefreshTokens.First(rt => rt.Token == "valid-token").IsRevoked);

        // 3. UpdateAsync ve SaveChanges çağrıldı mı?
        _mockUserRepo.Verify(repo => repo.UpdateAsync(user), Times.Once);
        _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(), Times.Once);
    }
}