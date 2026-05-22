using System.Globalization;
using System.Text;
using MiniETicaret.Domain.Entities;

namespace MiniETicaret.Application.Emails;
public static class EmailTemplates
{
    private const string FrontendUrl = "http://localhost:4200";
    private const string BrandColor = "#e8000d";
    private const string BrandDark = "#000000";

    public static string Welcome(string fullName)
    {
        var safeName = string.IsNullOrWhiteSpace(fullName) ? "değerli kullanıcı" : fullName;

        return BaseShell(
            title: "whoopsy'e Hoş Geldin",
            heading: $"Hoş geldin, {safeName}! 👋",
            bodyHtml: $@"
                  <p style=""margin:0 0 24px;color:#222222;font-size:16px;line-height:1.7;"">
                      whoopsy ailesine katıldığın için teşekkürler. Hesabın hazır — artık
                      yüzlerce ürüne göz atabilir, favorilerini kaydedebilir ve siparişlerini
                      rahatlıkla takip edebilirsin.
                  </p>
                  <div style=""text-align:center;margin:36px 0;"">
                      <a href=""{FrontendUrl}"" style=""background:{BrandColor};color:#ffffff;text-decoration:none;padding:16px 44px;border-radius:4px;display:inline-block;font-weight:bold;font-size:15px;letter-spacing:0.5px;"">
                          ALIŞVERİŞE BAŞLA
                      </a>
                  </div>
                  <p style=""margin:24px 0 0;color:#555555;font-size:14px;line-height:1.6;"">
                      Sorun yaşarsan bu maili yanıtlaman yeterli — sana en kısa sürede dönüş yaparız.
                  </p>"
        );
    }

    public static string OrderConfirmation(Order order)
    {
        var customerName = string.IsNullOrWhiteSpace(order.User?.FullName) ? "değerli müşterimiz" : order.User.FullName;
        var shortOrderId = order.Id.ToString()[..8].ToUpper();
        var culture = new CultureInfo("tr-TR");

        // Ürün satırlarını üret
        var itemsHtml = new StringBuilder();
        foreach (var item in order.OrderItems)
        {
            var productName = item.Product?.Name ?? "Ürün";
            var lineTotal = (item.Quantity * item.UnitPrice).ToString("N2", culture);
            itemsHtml.AppendLine($@"
                  <tr style=""border-bottom:1px solid #f0f0f0;"">
                      <td style=""padding:14px 0;color:#000000;font-size:15px;"">{productName}</td>
                      <td style=""padding:14px 0;text-align:center;color:#444444;font-size:15px;"">x{item.Quantity}</td>
                      <td style=""padding:14px 0;text-align:right;color:#000000;font-size:15px;font-weight:bold;"">{lineTotal} ₺</td>
                  </tr>");
        }

        var totalFormatted = order.TotalAmount.ToString("N2", culture);

        return BaseShell(
            title: "Siparişin Alındı",
            heading: "Siparişin alındı! 📦",
            bodyHtml: $@"
                  <p style=""margin:0 0 24px;color:#222222;font-size:16px;line-height:1.7;"">
                      Merhaba {customerName}, siparişini başarıyla aldık. Detaylar aşağıda.
                  </p>
                  <div style=""background:#f9f9f9;padding:18px 22px;border-radius:6px;margin:24px 0;border-left:3px solid {BrandColor};"">
                      <p style=""margin:0;color:#666666;font-size:13px;letter-spacing:0.5px;font-weight:bold;"">SİPARİŞ NO</p>
                      <p style=""margin:6px 0 0;color:#000000;font-weight:bold;font-family:'Courier New',monospace;font-size:16px;"">
                          #{shortOrderId}
                      </p>
                  </div>
                  <h3 style=""color:#000000;border-bottom:2px solid #f0f0f0;padding-bottom:10px;margin:32px 0 12px;font-size:17px;"">Ürünler</h3>
                  <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""border-collapse:collapse;"">
                      {itemsHtml}
                  </table>
                  <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""border-top:2px solid #000000;margin-top:16px;"">
                      <tr>
                          <td style=""padding:18px 0;color:#000000;font-weight:bold;font-size:18px;letter-spacing:0.5px;"">TOPLAM</td>
                          <td style=""padding:18px 0;color:{BrandColor};font-weight:bold;font-size:22px;text-align:right;"">{totalFormatted} ₺</td>
                      </tr>
                  </table>
                  <h3 style=""color:#000000;margin:36px 0 10px;font-size:17px;"">Teslimat Adresi</h3>
                  <p style=""margin:0;color:#333333;line-height:1.7;font-size:15px;"">{order.ShippingAddress}</p>"
        );
    }

    // Admin başvurusu yapıldığında kurucu admin'e gider — onay/red linkleri içerir.
    public static string AdminApprovalRequest(
        string applicantName,
        string applicantEmail,
        string applicantPhone,
        string approveUrl,
        string rejectUrl)
    {
        var safeName = string.IsNullOrWhiteSpace(applicantName) ? "(isimsiz)" : applicantName;
        var safePhone = string.IsNullOrWhiteSpace(applicantPhone) ? "—" : applicantPhone;

        return BaseShell(
            title: "Yeni Admin Başvurusu",
            heading: "Yeni admin başvurusu 🛡️",
            bodyHtml: $@"
                  <p style=""margin:0 0 24px;color:#222222;font-size:16px;line-height:1.7;"">
                      Aşağıdaki kullanıcı admin olmak için başvuru yaptı. Detayları kontrol et,
                      ardından <b>Onayla</b> veya <b>Reddet</b> linkine tıkla. Token 24 saat
                      sonra geçersiz olacak.
                  </p>
                  <div style=""background:#f9f9f9;padding:18px 22px;border-radius:6px;margin:24px 0;border-left:3px solid {BrandColor};"">
                      <p style=""margin:0;color:#666666;font-size:13px;letter-spacing:0.5px;font-weight:bold;"">AD SOYAD</p>
                      <p style=""margin:6px 0 16px;color:#000000;font-weight:bold;font-size:16px;"">{safeName}</p>
                      <p style=""margin:0;color:#666666;font-size:13px;letter-spacing:0.5px;font-weight:bold;"">E-POSTA</p>
                      <p style=""margin:6px 0 16px;color:#000000;font-size:15px;font-family:'Courier New',monospace;"">{applicantEmail}</p>
                      <p style=""margin:0;color:#666666;font-size:13px;letter-spacing:0.5px;font-weight:bold;"">TELEFON</p>
                      <p style=""margin:6px 0 0;color:#000000;font-size:15px;"">{safePhone}</p>
                  </div>
                  <div style=""text-align:center;margin:36px 0;"">
                      <a href=""{approveUrl}"" style=""background:#1a8f3b;color:#ffffff;text-decoration:none;padding:16px 36px;border-radius:4px;display:inline-block;font-weight:bold;font-size:15px;letter-spacing:0.5px;margin:4px;"">
                          ✓ ONAYLA
                      </a>
                      <a href=""{rejectUrl}"" style=""background:{BrandColor};color:#ffffff;text-decoration:none;padding:16px 36px;border-radius:4px;display:inline-block;font-weight:bold;font-size:15px;letter-spacing:0.5px;margin:4px;"">
                          ✗ REDDET
                      </a>
                  </div>
                  <p style=""margin:24px 0 0;color:#888888;font-size:13px;line-height:1.6;text-align:center;"">
                      Bu istek senin tarafından beklenmiyorsa <b>Reddet</b> linkine tıkla.
                  </p>"
        );
    }

    // Admin başvurusu onaylandığında başvurucuya gider.
    public static string AdminApproved(string fullName)
    {
        var safeName = string.IsNullOrWhiteSpace(fullName) ? "değerli kullanıcı" : fullName;

        return BaseShell(
            title: "Admin Başvurun Onaylandı",
            heading: $"Tebrikler, {safeName}! 🎉",
            bodyHtml: $@"
                  <p style=""margin:0 0 24px;color:#222222;font-size:16px;line-height:1.7;"">
                      Admin başvurun onaylandı. Artık whoopsy yönetim paneline giriş yapabilirsin.
                  </p>
                  <div style=""text-align:center;margin:36px 0;"">
                      <a href=""{FrontendUrl}/admin/login"" style=""background:{BrandColor};color:#ffffff;text-decoration:none;padding:16px 44px;border-radius:4px;display:inline-block;font-weight:bold;font-size:15px;letter-spacing:0.5px;"">
                          ADMİN GİRİŞİ
                      </a>
                  </div>
                  <p style=""margin:24px 0 0;color:#555555;font-size:14px;line-height:1.6;"">
                      Kayıt sırasında belirlediğin e-posta ve şifre ile giriş yapabilirsin.
                  </p>"
        );
    }

    // Admin başvurusu reddedildiğinde başvurucuya gider.
    public static string AdminRejected(string fullName)
    {
        var safeName = string.IsNullOrWhiteSpace(fullName) ? "değerli kullanıcı" : fullName;

        return BaseShell(
            title: "Admin Başvurun Reddedildi",
            heading: $"Üzgünüz, {safeName}",
            bodyHtml: $@"
                  <p style=""margin:0 0 24px;color:#222222;font-size:16px;line-height:1.7;"">
                      Admin başvurun bu kez onaylanmadı. whoopsy hesabın normal kullanıcı olarak
                      açık kalmaya devam edebilir.
                  </p>
                  <div style=""text-align:center;margin:36px 0;"">
                      <a href=""{FrontendUrl}"" style=""background:{BrandDark};color:#ffffff;text-decoration:none;padding:16px 44px;border-radius:4px;display:inline-block;font-weight:bold;font-size:15px;letter-spacing:0.5px;"">
                          ANA SAYFAYA DÖN
                      </a>
                  </div>"
        );
    }

    // Tüm mailler için ortak shell — header (siyah + kırmızı vurgu) + body + footer.
    private static string BaseShell(string title, string heading, string bodyHtml) => $@"
  <!DOCTYPE html>
  <html lang=""tr"">
  <head>
      <meta charset=""UTF-8"">
      <title>{title}</title>
  </head>
  <body style=""margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;"">
      <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background:#f4f4f4;padding:40px 0;"">
          <tr>
              <td align=""center"">
                  <table role=""presentation"" width=""600"" cellpadding=""0"" cellspacing=""0""
  style=""background:#ffffff;border-radius:8px;overflow:hidden;"">
                      <tr>
                          <td style=""background:#FAF6F0;padding:40px 32px;text-align:center;border-bottom:1px solid #ece6db;"">
                              <div style=""font-family:'Arial Black',Arial,Helvetica,sans-serif;font-size:48px;font-weight:900;line-height:1;letter-spacing:1px;"">
                                  <span style=""color:#000000;"">wh</span><span style=""position:relative;display:inline-block;color:{BrandColor};"">O<span style=""position:absolute;top:50%;left:50%;width:8px;height:8px;background:#000000;border-radius:50%;transform:translate(-50%,-50%);""></span></span><span style=""position:relative;display:inline-block;color:{BrandColor};"">O<span style=""position:absolute;top:50%;left:50%;width:8px;height:8px;background:#000000;border-radius:50%;transform:translate(-50%,-50%);""></span></span><span style=""color:{BrandColor};"">PS</span><span style=""color:#000000;"">y</span>
                              </div>
                          </td>
                      </tr>
                      <tr>
                          <td style=""padding:40px 32px;"">
                              <h2 style=""margin:0 0 20px;color:#000000;font-size:26px;line-height:1.3;font-weight:bold;"">
                                  {heading}
                              </h2>
                              {bodyHtml}
                          </td>
                      </tr>
                      <tr>
                          <td style=""background:#f9f9f9;padding:24px 32px;text-align:center;border-top:1px solid #e8e8e8;"">
                              <p style=""margin:0;color:#666666;font-size:13px;"">
                                  © 2026 whoopsy. Tüm hakları saklıdır.
                              </p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  </html>";
}