import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "../../modules/users/useCases/createUser/CreateUserError";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase"


let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

describe('Create an user', () => {
  beforeAll(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  })

  it('should be create new user', async () => {
    const user = {
      name: 'Rebecca Graham',
      email: 'ajsa@lobawofi.rw',
      password: '7anoExk3xCX3bn5E6yjj'
    }

    const result = await createUserUseCase.execute(user);

    expect(result).toHaveProperty('id');
  })

  it('should not be able add an user with duplicate email', async () => {
    const { email } = await userRepositoryInMemory.create({
      name: 'Alan McCormick',
      email: 'co@jid.org',
      password: 'U7Z8jNlLZx5xht3Hjm12'
    })

    await expect(
      createUserUseCase.execute({
        name: 'Agnes Farmer',
        email,
        password: 'QlQCsvchpy8uIQcPG6va'
      })
    ).rejects.toBeInstanceOf(CreateUserError)
  })
})
