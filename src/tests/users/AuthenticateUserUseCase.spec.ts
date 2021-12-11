import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "../../modules/users/useCases/authenticateUser/IncorrectEmailOrPasswordError";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";


let authenticateUserUseCase: AuthenticateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate user', () => {
  beforeAll(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  })

  it('should be able authenticate an user', async () => {
    const { email } = await createUserUseCase.execute({
      name: 'Alan McCormick',
      email: 'co@jid.org',
      password: '123456'
    })

    const result = await authenticateUserUseCase.execute({ email, password: '123456' });

    expect(result).toHaveProperty('token');
  });

  it('should not be able authenticate an user that does not exists', async () => {
    await createUserUseCase.execute({
      name: 'Matilda Clarke',
      email: 'gigge@tun.li',
      password: '123456'
    })

    await expect(
      authenticateUserUseCase.execute({
        email: 'tomaaso@pubepi.sl',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  });

  it('should not be able authenticate an user with incorrect password', async () => {
    const { email } = await createUserUseCase.execute({
      name: 'Christopher Gomez',
      email: 'gizab@zeghi.aw',
      password: '123456'
    })

    await expect(
      authenticateUserUseCase.execute({
        email,
        password: 'incorrect-password'
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  });
})
