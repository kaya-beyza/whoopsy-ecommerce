// Login isteği — Backend'deki LoginCommand'ın frontend karşılığı
  export interface LoginRequest { //export → "Bu dosyayı başka dosyalar da kullanabilsin" demek. Backend'deki public ile aynı mantık.
    email: string;
    password: string;
  }

  // Register isteği — Backend'deki RegisterCommand'ın frontend karşılığı
  export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
   /* phoneNumber?: string;    
    address?: string;     
    gender?: number;      
    birthDate?: string;  */
  }

  // Backend'den dönen token yanıtı — Backend'deki TokenDto'nun frontend karşılığı
  export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  }
