using MediatR;
namespace MiniETicaret.Application.Features.Auth.Command.Register;

/* Sırada kullanıcı kayıt olma işlemi var. Login'de kullanıcıyı buluyorduk, Register'da ise yeni kullanıcı oluşturacağız.                            
  Register'ın yapacağı işler:                                                                                                                      1. Bu email daha önce kullanılmış mı? → Kontrol et
  2. Kullanılmışsa → hata fırlat                                                                                                                   3. Şifreyi hashle (düz şifre veritabanına yazılmaz!)
  4. Yeni AppUser oluştur                                                                                                                        
  5. Veritabanına kaydet                                                                                                                         
  6. Kullanıcının Id'sini döndür */

  public class RegisterCommand : IRequest<Guid> //IRequest<Guid> Bu komut geriye Guid döndürecek
{
    public string FullName{get;set;}=string.Empty;
    public string Email{get;set;}=string.Empty;
    public string Password{get;set;}=string.Empty;
}