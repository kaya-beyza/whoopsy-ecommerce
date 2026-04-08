namespace MiniETicaret.Application.Interfaces;

  public class FileUploadResult
  {
      public string PublicId { get; set; } = string.Empty;
      public string Url { get; set; } = string.Empty;
  }

  public interface IFileService
  {
      Task<FileUploadResult> UploadImageAsync(Stream fileStream, string fileName, string folder = "products");
      Task<bool> DeleteImageAsync(string publicId);
  }