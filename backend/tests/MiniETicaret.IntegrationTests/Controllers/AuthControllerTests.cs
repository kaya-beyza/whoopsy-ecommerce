using System.Net;
using System.Net.Http.Json;

namespace MiniETicaret.IntegrationTests.Controllers;

public class AuthControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public AuthControllerTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    // ══════════════════════════════════════════
    // TEST 1: Başarılı kayıt — 200 dönmeli
    // ══════════════════════════════════════════
    [Fact]
    public async Task Register_ValidUser_ReturnsOk()
    {
        // ARRANGE — geçerli kullanıcı bilgileri
        var registerRequest = new
        {
            FullName = "Test Kullanıcı",
            Email = "test@example.com",
            Password = "Test123!"
        };

        // ACT — register endpoint'ine POST at
        var response = await _client.PostAsJsonAsync("/api/Auth/register", registerRequest);

        // ASSERT — 200 OK dönmeli
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    // ══════════════════════════════════════════
    // TEST 2: Aynı email ile tekrar kayıt — hata dönmeli
    // ══════════════════════════════════════════
    [Fact]
    public async Task Register_DuplicateEmail_ReturnsError()
    {
        // ARRANGE — aynı email ile iki kayıt denemesi
        var registerRequest = new
        {
            FullName = "Duplicate User",
            Email = "duplicate@example.com",
            Password = "Test123!"
        };

        // İlk kayıt — başarılı olmalı
        await _client.PostAsJsonAsync("/api/Auth/register", registerRequest);

        // ACT — aynı email ile tekrar kayıt
        var response = await _client.PostAsJsonAsync("/api/Auth/register", registerRequest);

        // ASSERT — 500 dönmeli (email zaten var)
        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
    }

    // ══════════════════════════════════════════
    // TEST 3: Kayıt ol → Giriş yap — token dönmeli
    // ══════════════════════════════════════════
    [Fact]
    public async Task Login_AfterRegister_ReturnsToken()
    {
        // ARRANGE — önce kayıt ol
        var registerRequest = new
        {
            FullName = "Login Test User",
            Email = "logintest@example.com",
            Password = "Login123!"
        };
        await _client.PostAsJsonAsync("/api/Auth/register", registerRequest);

        // ACT — giriş yap
        var loginRequest = new
        {
            Email = "logintest@example.com",
            Password = "Login123!"
        };
        var response = await _client.PostAsJsonAsync("/api/Auth/login", loginRequest);

        // ASSERT — 200 OK ve body'de token olmalı
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("accessToken", body);
    }

    // ══════════════════════════════════════════
    // TEST 4: Yanlış şifre ile giriş — hata dönmeli
    // ══════════════════════════════════════════
    [Fact]
    public async Task Login_WrongPassword_ReturnsError()
    {
        // ARRANGE — önce kayıt ol
        var registerRequest = new
        {
            FullName = "Wrong Pass User",
            Email = "wrongpass@example.com",
            Password = "Correct123!"
        };
        await _client.PostAsJsonAsync("/api/Auth/register", registerRequest);

        // ACT — yanlış şifre ile giriş dene
        var loginRequest = new
        {
            Email = "wrongpass@example.com",
            Password = "YanlisParola!"
        };
        var response = await _client.PostAsJsonAsync("/api/Auth/login", loginRequest);

        // ASSERT — başarısız olmalı
        Assert.NotEqual(HttpStatusCode.OK, response.StatusCode);
    }
}