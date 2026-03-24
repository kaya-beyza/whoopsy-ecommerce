using Moq;
using MiniETicaret.Application.Features.Auth.Queries.GetUsers;
using MiniETicaret.Application.Interfaces;
using MiniETicaret.Domain.Entities;

namespace MiniETicaret.UnitTests.Features.Auth.QueriesTest;

public class GetUsersQueryHandlerTests
{
    private readonly Mock<IUserRepository> _mockUserRepo;
    private readonly GetUsersQueryHandler _handler;

    public GetUsersQueryHandlerTests()
    {
        _mockUserRepo = new Mock<IUserRepository>();
        _handler = new GetUsersQueryHandler(_mockUserRepo.Object);
    }
    // ══════════════════════════════════════════
    // TEST 1: Kullanıcı yoksa boş liste döner
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_NoUsers_ReturnsEmptyList()
    {
        // ARRANGE — veritabanında hiç kullanıcı yok
        _mockUserRepo
            .Setup(repo => repo.GetAllAsync(1, 10))
            .ReturnsAsync(new List<AppUser>());

        var query = new GetUsersQuery
        {
            Page = 1,
            Size = 10
        };

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);

        // ASSERT
        Assert.NotNull(result);
        Assert.Empty(result);
    }

    // ══════════════════════════════════════════                                                                                                         
    // TEST 2: Kullanıcılar varsa doğru liste döner
    // ══════════════════════════════════════════
    [Fact]
    public async Task Handle_UsersExist_ReturnsUserDtoList()
    {
        // ARRANGE — veritabanında 2 kullanıcı var
        var users = new List<AppUser>
          {
              new AppUser
              {
                  Id = Guid.NewGuid(),
                  FullName = "Ahmet Yılmaz",
                  Email = "ahmet@mail.com",
                  IsActive = true,
                  RoleId = Guid.NewGuid(),
                  Role = new Role { Id = Guid.NewGuid(), Name = "Admin" }
              },
              new AppUser
              {
                  Id = Guid.NewGuid(),
                  FullName = "Elif Demir",
                  Email = "elif@mail.com",
                  IsActive = false,
                  RoleId = Guid.NewGuid(),
                  Role = new Role { Id = Guid.NewGuid(), Name = "User" }
              }
          };

        _mockUserRepo
            .Setup(repo => repo.GetAllAsync(1, 10))
            .ReturnsAsync(users);

        var query = new GetUsersQuery
        {
            Page = 1,
            Size = 10
        };

        // ACT
        var result = await _handler.Handle(query, CancellationToken.None);

        // ASSERT
        // 1. Listede 2 kullanıcı olmalı
        Assert.Equal(2, result.Count);

        // 2. İlk kullanıcının bilgileri doğru mu?
        Assert.Equal("Ahmet Yılmaz", result[0].FullName);
        Assert.Equal("ahmet@mail.com", result[0].Email);
        Assert.True(result[0].IsActive);
        Assert.Equal("Admin", result[0].RoleName);

        // 3. İkinci kullanıcının bilgileri doğru mu?
        Assert.Equal("Elif Demir", result[1].FullName);
        Assert.Equal("elif@mail.com", result[1].Email);
        Assert.False(result[1].IsActive);
        Assert.Equal("User", result[1].RoleName);
    }
}