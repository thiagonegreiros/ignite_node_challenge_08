
import { OperationType, Statement } from "../../modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "../../modules/statements/useCases/createStatement/CreateStatementError";
import { CreateStatementUseCase } from "../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository"

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe('Create statement', () => {
  beforeAll(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementRepositoryInMemory);
  })

  it('should be able create a statement', async () => {
    const { id } = await usersRepositoryInMemory.create({
      name: 'Jayden Rhodes',
      email: 'dijhuduc@diug.dk',
      password: 'agRQSBkDIDEORTKDvFHf'
    });

    const result = await createStatementUseCase.execute({
      amount: 50,
      description: '6XoXEglj2TEccGbaPIFq',
      type: OperationType.DEPOSIT,
      user_id: id!
    });

    expect(result).toBeInstanceOf(Statement);
    expect(result.type).toBe(OperationType.DEPOSIT);
    expect(result).toHaveProperty('id');
  })

  it('should be not able create a statement if user that does not exist', async () => {
     await expect(
      createStatementUseCase.execute({
        amount: 50,
        description: '6XoXEglj2TEccGbaPIFq',
        type: OperationType.DEPOSIT,
        user_id: 'invalid-user'
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it('should not be able to create a statement if the deposit is less withdrawn', async () => {
    const { id } = await usersRepositoryInMemory.create({
      name: 'Jayden Rhodes',
      email: 'dijhuduc@diug.dk',
      password: 'agRQSBkDIDEORTKDvFHf'
    });

    await createStatementUseCase.execute({
      amount: 50,
      description: '6XoXEglj2TEccGbaPIFq',
      type: OperationType.DEPOSIT,
      user_id: id!
    });

    await expect(
      createStatementUseCase.execute({
        amount: 70,
        description: '6XoXEglj2TEccGbaPIFq',
        type: OperationType.WITHDRAW,
        user_id: id!
      })
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
