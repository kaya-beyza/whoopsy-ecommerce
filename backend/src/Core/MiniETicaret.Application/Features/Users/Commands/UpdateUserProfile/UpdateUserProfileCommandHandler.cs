using MediatR;
using MiniETicaret.Application.Interfaces;

namespace MiniETicaret.Application.Features.Users.Commands.UpdateUserProfile;

public class UpdateUserProfileCommandHandler : IRequestHandler<UpdateUserProfileCommand, UpdateUserProfileCommandResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateUserProfileCommandHandler(IUserRepository userRepository, IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<UpdateUserProfileCommandResponse> Handle(UpdateUserProfileCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId);

        if (user == null)
        {
            return new UpdateUserProfileCommandResponse
            {
                Success = false,
                Message = "Kullanıcı bulunamadı."
            };
        }

        user.FullName = request.FullName;
        user.PhoneNumber = request.PhoneNumber;
        user.Address = request.Address;
        user.BirthDate = request.BirthDate;
        user.UpdatedDate = DateTime.UtcNow.AddHours(3);

        await _unitOfWork.SaveChangesAsync();

        return new UpdateUserProfileCommandResponse
        {
            Success = true,
            Message = "Profil başarıyla güncellendi."
        };
    }
}