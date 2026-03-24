using Moq;
using MiniETicaret.Application.DTOs;
using MiniETicaret.Application.Features.Auth.Commands.Login;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;

namespace MiniETicaret.UnitTests.Features.Auth;

public class LoginCommandHandlerTests
{
    // Mock nesneleri — sahte bağımlılıklar
    // Her test için aynı mock'ları kullanacağız, o yüzden class seviyesinde tanımlıyoruz
    private readonly Mock<IUserRepository> _mockUserRepo;
    private readonly Mock<ITokenService> _mockTokenService;
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly LoginCommandHandler _handler;

    // Constructor — her test çalışmadan önce otomatik çağrılır
    // Her test temiz mock'larla başlar (testler birbirini etkilemez)
    public LoginCommandHandlerTests()
    {
        _mockUserRepo = new Mock<IUserRepository>();
        _mockTokenService = new Mock<ITokenService>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();

        // Handler'a gerçek değil, MOCK bağımlılıklar veriyoruz
        // Handler farkı bilmiyor — aynı interface'i implement ediyorlar
        _handler = new LoginCommandHandler(
            _mockUserRepo.Object,
            _mockTokenService.Object,
            _mockUnitOfWork.Object
        );
    }

    // ══════════════════════════════════════════
    // TEST 1: Kullanıcı bulunamazsa hata fırlat
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_UserNotFound_ThrowsUnauthorizedAccessException()
    {
        // ARRANGE (Hazırlık) — test ortamını kur
        // Mock'a diyoruz ki: "Biri sana GetByEmailAsync çağırırsa, null döndür"
        // Yani "kullanıcı bulunamadı" senaryosunu simüle ediyoruz
        _mockUserRepo
            .Setup(repo => repo.GetByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync((AppUser?)null);

        var command = new LoginCommand
        {
            Email = "yok@mail.com",
            Password = "sifre123"
        };

        // ACT & ASSERT (Çalıştır ve Kontrol Et)
        // Handler çalıştığında UnauthorizedAccessException fırlatmalı
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => _handler.Handle(command, CancellationToken.None)
        );
    }

    // ══════════════════════════════════════════
    // TEST 2: Pasif kullanıcı giriş yapamaz
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_UserIsInactive_ThrowsUnauthorizedAccessException()
    {
        // ARRANGE — pasif bir kullanıcı oluştur
        var inactiveUser = new AppUser
        {
            Id = Guid.NewGuid(),
            Email = "pasif@mail.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("sifre123"),
            IsActive = false,  // ← PASIF
            FullName = "Pasif Kullanıcı",
            RoleId = Guid.NewGuid()
        };

        _mockUserRepo
            .Setup(repo => repo.GetByEmailAsync("pasif@mail.com"))
            .ReturnsAsync(inactiveUser);

        var command = new LoginCommand
        {
            Email = "pasif@mail.com",
            Password = "sifre123"
        };

        // ACT & ASSERT — pasif kullanıcı için hata fırlatmalı
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => _handler.Handle(command, CancellationToken.None)
        );
    }

    // ══════════════════════════════════════════
    // TEST 3: Yanlış şifre girilirse hata fırlat
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_WrongPassword_ThrowsUnauthorizedAccessException()
    {
        // ARRANGE — doğru şifresi "dogru123" olan kullanıcı
        var user = new AppUser
        {
            Id = Guid.NewGuid(),
            Email = "ahmet@mail.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("dogru123"),
            IsActive = true,
            FullName = "Ahmet Yılmaz",
            RoleId = Guid.NewGuid()
        };

        _mockUserRepo
            .Setup(repo => repo.GetByEmailAsync("ahmet@mail.com"))
            .ReturnsAsync(user);

        // Yanlış şifre gönderiyoruz
        var command = new LoginCommand
        {
            Email = "ahmet@mail.com",
            Password = "yanlis999"  // ← YANLIŞ ŞİFRE
        };

        // ACT & ASSERT
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => _handler.Handle(command, CancellationToken.None)
        );
    }

    // ══════════════════════════════════════════
    // TEST 4: Doğru bilgilerle giriş başarılı
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_ValidCredentials_ReturnsTokenDto()
    {
        // ARRANGE — aktif kullanıcı + doğru şifre
        var user = new AppUser
        {
            Id = Guid.NewGuid(),
            Email = "ahmet@mail.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("dogru123"),
            IsActive = true,
            FullName = "Ahmet Yılmaz",
            RoleId = Guid.NewGuid(),
            Role = new Role { Id = Guid.NewGuid(), Name = "Admin" }
        };

        // Mock repository: kullanıcıyı döndür
        _mockUserRepo
            .Setup(repo => repo.GetByEmailAsync("ahmet@mail.com"))
            .ReturnsAsync(user);

        // Mock token service: sahte token'lar döndür
        _mockTokenService
            .Setup(ts => ts.GenerateAccessToken(It.IsAny<AppUser>()))
            .Returns("fake-access-token");

        _mockTokenService
            .Setup(ts => ts.GenerateRefreshToken())
            .Returns("fake-refresh-token");

        // Mock unit of work: kaydetme başarılı
        _mockUnitOfWork
            .Setup(uow => uow.SaveChangesAsync())
            .ReturnsAsync(1);

        var command = new LoginCommand
        {
            Email = "ahmet@mail.com",
            Password = "dogru123"  // ← DOĞRU ŞİFRE
        };

        // ACT — handler'ı çalıştır
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT — sonuçları kontrol et
        Assert.NotNull(result);                           // Sonuç null olmamalı
        Assert.Equal("fake-access-token", result.AccessToken);   // Access token doğru mu
        Assert.Equal("fake-refresh-token", result.RefreshToken); // Refresh token doğru mu
    }
}