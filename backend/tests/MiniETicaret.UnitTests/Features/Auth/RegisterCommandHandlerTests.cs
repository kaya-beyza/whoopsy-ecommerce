using Moq;
using MiniETicaret.Application.Features.Auth.Commands.Register;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;

namespace MiniETicaret.UnitTests.Features.Auth;

public class RegisterCommandHandlerTests
{
    private readonly Mock<IUserRepository> _mockUserRepo;
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly RegisterCommandHandler _handler;

    public RegisterCommandHandlerTests()
    {
        _mockUserRepo = new Mock<IUserRepository>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();

        _handler = new RegisterCommandHandler(
            _mockUserRepo.Object,
            _mockUnitOfWork.Object
        );
    }
    // ══════════════════════════════════════════                                                                                                         
    // TEST 1: Email zaten kayıtlıysa hata fırlat
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_EmailAlreadyExists_ThrowsInvalidOperationException()
    {
        // ARRANGE — bu email ile zaten bir kullanıcı var
        var existingUser = new AppUser
        {
            Id = Guid.NewGuid(),
            FullName = "Mevcut Kullanıcı",
            Email = "ahmet@mail.com",
            PasswordHash = "hash",
            IsActive = true,
            RoleId = Guid.NewGuid()
        };

        _mockUserRepo
            .Setup(repo => repo.GetByEmailAsync("ahmet@mail.com"))
            .ReturnsAsync(existingUser);

        var command = new RegisterCommand
        {
            FullName = "Ahmet Yılmaz",
            Email = "ahmet@mail.com",
            Password = "sifre123"
        };

        // ACT & ASSERT
        await Assert.ThrowsAsync<InvalidOperationException>(
            () => _handler.Handle(command, CancellationToken.None)
        );
    }
    // ══════════════════════════════════════════                                                                                                         
    // TEST 2: Geçerli bilgilerle kayıt başarılı
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_ValidRegistration_ReturnsGuidAndSavesUser()
    {
        // ARRANGE — bu email ile kimse kayıtlı değil
        _mockUserRepo
            .Setup(repo => repo.GetByEmailAsync("yeni@mail.com"))
            .ReturnsAsync((AppUser?)null);

        _mockUnitOfWork
            .Setup(uow => uow.SaveChangesAsync())
            .ReturnsAsync(1);

        var command = new RegisterCommand
        {
            FullName = "Yeni Kullanıcı",
            Email = "yeni@mail.com",
            Password = "sifre123"
        };

        // ACT
        var result = await _handler.Handle(command, CancellationToken.None);

        // ASSERT
        // 1. Geriye bir Guid dönmeli (boş olmamalı)
        Assert.IsType<Guid>(result);

        // 2. AddAsync çağrılmış mı? (kullanıcı veritabanına eklendi mi?)
        _mockUserRepo.Verify(
            repo => repo.AddAsync(It.Is<AppUser>(u =>
                u.Email == "yeni@mail.com" &&
                u.FullName == "Yeni Kullanıcı"
            )),
            Times.Once
        );

        // 3. SaveChangesAsync çağrılmış mı? (değişiklikler kaydedildi mi?)
        _mockUnitOfWork.Verify(
            uow => uow.SaveChangesAsync(),
            Times.Once
        );
    }
}