import { OperationType, Statement } from "../../modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { GetBalanceError } from "../../modules/statements/useCases/getBalance/GetBalanceError";
import { GetBalanceUseCase } from "../../modules/statements/useCases/getBalance/GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe('Create statement', () => {
  beforeAll(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementRepositoryInMemory, usersRepositoryInMemory)
  })

  it('should be able get a balance', async () => {
    const { id } = await usersRepositoryInMemory.create({
      name: 'Jayden Rhodes',
      email: 'dijhuduc@diug.dk',
      password: 'agRQSBkDIDEORTKDvFHf'
    });

    await statementRepositoryInMemory.create({
      amount: 50,
      description: '6XoXEglj2TEccGbaPIFq',
      type: OperationType.DEPOSIT,
      user_id: id!
    });

    const result = await getBalanceUseCase.execute({ user_id: id! });

    expect(result).toHaveProperty('statement');
    expect(result).toHaveProperty('balance');
  })

  it('should not be able get a balance if o user does not exist', async () => {
    await expect(
      getBalanceUseCase.execute({ user_id: 'invalid-user' })
    ).rejects.toBeInstanceOf(GetBalanceError)
  })
})
