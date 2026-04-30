using System.Net;
using System.Net.Http.Json;
using System.Net.Http.Headers;

namespace MiniETicaret.IntegrationTests.Controllers;

public class UsersControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public UsersControllerTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    // ══════════════════════════════════════════
    // YARDIMCI METHOD: Kayıt ol + Giriş yap + Token al
    // ══════════════════════════════════════════
    private async Task<string> RegisterAndLogin(string email)
    {
        var register = new
        {
            FullName = "Test User",
            Email = email,
            Password = "Test123!",
            PhoneNumber = "05551234567",
            BirthDate = new DateTime(1990, 1, 1)
        };
        await _client.PostAsJsonAsync("/api/Auth/register", register);

        var login = new { Email = email, Password = "Test123!" };
        var loginResponse = await _client.PostAsJsonAsync("/api/Auth/login", login);
        var body = await loginResponse.Content.ReadAsStringAsync();

        var doc = System.Text.Json.JsonDocument.Parse(body);
        var token = doc.RootElement.GetProperty("accessToken").GetString();

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        return token!;
    }

    // ══════════════════════════════════════════
    // TEST 1: Kullanıcı listesi — 200 OK dönmeli
    // ══════════════════════════════════════════
    [Fact]
    public async Task GetAllUsers_ReturnsOk()
    {
        // ARRANGE — giriş yap (token lazım)
        await RegisterAndLogin("users-list@test.com");

        // ACT — kullanıcıları getir
        var response = await _client.GetAsync("/api/Users");

        // ASSERT — 200 OK
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    // ══════════════════════════════════════════
    // TEST 2: Kullanıcı detayı — kayıtlı kullanıcıyı ID ile getir
    // ══════════════════════════════════════════
    [Fact]
    public async Task GetUserById_ExistingUser_ReturnsOk()
    {
        // ARRANGE — kayıt ol + giriş yap
        await RegisterAndLogin("user-detail@test.com");

        // Önce listeden bir kullanıcının ID'sini al
        var listResponse = await _client.GetAsync("/api/Users");
        var body = await listResponse.Content.ReadAsStringAsync();
        var doc = System.Text.Json.JsonDocument.Parse(body);
        var firstUserId = doc.RootElement[0].GetProperty("id").GetString();

        // ACT — o kullanıcının detayını getir
        var response = await _client.GetAsync($"/api/Users/{firstUserId}");

        // ASSERT — 200 OK
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    // ══════════════════════════════════════════
    // TEST 3: Kullanıcının sipariş geçmişi — 200 OK dönmeli
    // ══════════════════════════════════════════
    [Fact]
    public async Task GetUserOrderHistory_ReturnsOk()
    {
        // ARRANGE — kayıt ol + giriş yap
        await RegisterAndLogin("user-orders@test.com");

        // Listeden bir kullanıcının ID'sini al
        var listResponse = await _client.GetAsync("/api/Users");
        var body = await listResponse.Content.ReadAsStringAsync();
        var doc = System.Text.Json.JsonDocument.Parse(body);
        var firstUserId = doc.RootElement[0].GetProperty("id").GetString();

        // ACT — sipariş geçmişini getir
        var response = await _client.GetAsync($"/api/Users/{firstUserId}/orders");

        // ASSERT — 200 OK
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}