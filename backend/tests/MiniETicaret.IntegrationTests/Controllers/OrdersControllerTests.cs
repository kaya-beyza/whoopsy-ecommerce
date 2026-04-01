using System.Net;
using System.Net.Http.Json;
using System.Net.Http.Headers;

namespace MiniETicaret.IntegrationTests.Controllers;

public class OrdersControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public OrdersControllerTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    // ══════════════════════════════════════════
    // YARDIMCI METHOD: Kayıt ol + Giriş yap + Token al + UserId döndür
    // ══════════════════════════════════════════
    private async Task<(string token, Guid userId)> RegisterAndLogin(string email)
    {
        // 1) Kayıt ol
        var register = new
        {
            FullName = "Test User",
            Email = email,
            Password = "Test123!"
        };
        var registerResponse = await _client.PostAsJsonAsync("/api/Auth/register", register);
        var registerBody = await registerResponse.Content.ReadAsStringAsync();
        var userId = Guid.Parse(registerBody.Trim('"'));

        // 2) Giriş yap
        var login = new { Email = email, Password = "Test123!" };
        var loginResponse = await _client.PostAsJsonAsync("/api/Auth/login", login);
        var body = await loginResponse.Content.ReadAsStringAsync();

        // 3) Token'ı JSON'dan çıkar
        var doc = System.Text.Json.JsonDocument.Parse(body);
        var token = doc.RootElement.GetProperty("accessToken").GetString();

        // 4) Client'a token'ı ekle
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        return (token!, userId);
    }

    // ══════════════════════════════════════════
    // YARDIMCI METHOD: Test için ürün oluştur
    // ══════════════════════════════════════════
    private async Task<Guid> CreateTestProduct()
    {
        var category = new { Name = "Test Kategori" };
        var catResponse = await _client.PostAsJsonAsync("/api/Categories", category);
        var catBody = await catResponse.Content.ReadAsStringAsync();
        var categoryId = Guid.Parse(catBody.Trim('"'));

        var product = new
        {
            Name = "Test Ürün",
            Description = "Test açıklama",
            Price = 100.00m,
            StockQuantity = 50,
            CategoryId = categoryId
        };
        var prodResponse = await _client.PostAsJsonAsync("/api/Products", product);
        var prodBody = await prodResponse.Content.ReadAsStringAsync();
        return Guid.Parse(prodBody.Trim('"'));
    }

    // ══════════════════════════════════════════
    // TEST 1: Sipariş oluştur — 201 Created dönmeli
    // ══════════════════════════════════════════
    [Fact]
    public async Task CreateOrder_ValidData_ReturnsCreated()
    {
        var (_, userId) = await RegisterAndLogin("order-create@test.com");
        var productId = await CreateTestProduct();

        var order = new
        {
            UserId = userId,
            ShippingAddress = "Test Adres, İstanbul",
            OrderItems = new[]
            {
                  new { ProductId = productId, Quantity = 2, UnitPrice = 100.00m }
              }
        };

        var response = await _client.PostAsJsonAsync("/api/Orders", order);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    // ══════════════════════════════════════════
    // TEST 2: Siparişleri listele — 200 OK dönmeli
    // ══════════════════════════════════════════
    [Fact]
    public async Task GetOrders_ReturnsOk()
    {
        var (_, _) = await RegisterAndLogin("order-list@test.com");

        var response = await _client.GetAsync("/api/Orders");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    // ══════════════════════════════════════════
    // TEST 3: Sipariş detayı — oluşturulan siparişi ID ile getir
    // ══════════════════════════════════════════
    [Fact]
    public async Task GetOrderById_ExistingOrder_ReturnsOk()
    {
        var (_, userId) = await RegisterAndLogin("order-detail@test.com");
        var productId = await CreateTestProduct();

        var order = new
        {
            UserId = userId,
            ShippingAddress = "Detay Test Adres",
            OrderItems = new[]
            {
                  new { ProductId = productId, Quantity = 1, UnitPrice = 50.00m }
              }
        };
        var createResponse = await _client.PostAsJsonAsync("/api/Orders", order);
        var orderId = await createResponse.Content.ReadFromJsonAsync<Guid>();

        var response = await _client.GetAsync($"/api/Orders/{orderId}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    // ══════════════════════════════════════════
    // TEST 4: Sipariş durumu güncelle — 204 NoContent dönmeli
    // ══════════════════════════════════════════
    [Fact]
    public async Task UpdateOrderStatus_ReturnsNoContent()
    {
        var (_, userId) = await RegisterAndLogin("order-status@test.com");
        var productId = await CreateTestProduct();

        var order = new
        {
            UserId = userId,
            ShippingAddress = "Status Test Adres",
            OrderItems = new[]
            {
                  new { ProductId = productId, Quantity = 1, UnitPrice = 75.00m }
              }
        };
        var createResponse = await _client.PostAsJsonAsync("/api/Orders", order);
        var orderId = await createResponse.Content.ReadFromJsonAsync<Guid>();

        var statusUpdate = new { OrderId = orderId, NewStatus = 1 };
        var response = await _client.PutAsJsonAsync($"/api/Orders/{orderId}/status", statusUpdate);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }
}