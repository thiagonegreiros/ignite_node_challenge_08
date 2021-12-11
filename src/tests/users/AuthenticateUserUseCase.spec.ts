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
    const { email }= await createUserUseCase.execute({
      name: 'Alan McCormick',
      email: 'co@jid.org',
      password: '123456'
     })

    const result = await authenticateUserUseCase.execute({ email, password: '123456' });

    expect(result).toHaveProperty('token');
  })

  // it('should not be able add an user with duplicate email', async () => {
  //   const { email } = await userRepositoryInMemory.create({
  //     name: 'Alan McCormick',
  //     email: 'co@jid.org',
  //     password: 'U7Z8jNlLZx5xht3Hjm12'
  //   })

  //   await expect(
  //     createUserUseCase.execute({
  //       name: 'Agnes Farmer',
  //       email,
  //       password: 'QlQCsvchpy8uIQcPG6va'
  //     })
  //   ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  // })
})
