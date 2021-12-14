import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";
import { ShowUserProfileError } from "../../modules/users/useCases/showUserProfile/ShowUserProfileError";
import { ShowUserProfileUseCase } from "../../modules/users/useCases/showUserProfile/ShowUserProfileUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let showProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe('show user profile', () => {
  beforeAll(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    showProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  })

  it('should be able list an user by user id', async () => {
    const { id } = await createUserUseCase.execute({
      name: 'Andre Lucas',
      email: 'puh@de.sx',
      password: 'nY3wlqRF0Z6FZpJdF9r6'
    });

    const result = await showProfileUseCase.execute(id!);

    expect(result).toHaveProperty('id');
  })

  it('should not be able to find id that does not exist', async () => {
    await expect(
      showProfileUseCase.execute('identify-not-found')
    ).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
