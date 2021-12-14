import { OperationType, Statement } from "../../modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "../../modules/statements/useCases/getStatementOperation/GetStatementOperationError";
import { GetStatementOperationUseCase } from "../../modules/statements/useCases/getStatementOperation/GetStatementOperationUseCase";
import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";


let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe('Get Statement Operation', () => {
  beforeAll(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementRepositoryInMemory);
  })

  it('should be able get a statement operation', async () => {
    const { id: user_id } = await usersRepositoryInMemory.create({
      name: 'Maud Dean',
      email: 'pelce@aco.bf',
      password: '4UpblNwYWWB9rtgjQI6j'
    })

    const { id: statement_id } = await statementRepositoryInMemory.create({
      amount: 50,
      description: 'ozCfzAHMlIxgNGdlhAhg',
      type: OperationType.DEPOSIT,
      user_id: user_id!
    })

    const result = await getStatementOperationUseCase.execute({
      user_id: user_id!,
      statement_id: statement_id!
    })

    expect(result).toBeInstanceOf(Statement);
  })

  it('should not be able get a operation that user does not exist', async () => {
    const { id: statement_id } = await statementRepositoryInMemory.create({
      amount: 50,
      description: 'ozCfzAHMlIxgNGdlhAhg',
      type: OperationType.DEPOSIT,
      user_id: 'sCwc8NCK6jS2o1B1OOIX'
    })

    await expect(
      getStatementOperationUseCase.execute({ user_id: 'invalid-user', statement_id: statement_id! })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it('should not be able get a operation that does not exist', async () => {
    const { id: user_id } = await usersRepositoryInMemory.create({
      name: 'Maud Dean',
      email: 'pelce@aco.bf',
      password: '4UpblNwYWWB9rtgjQI6j'
    })

    await expect(
      getStatementOperationUseCase.execute({ user_id: user_id!, statement_id: 'invalid-statement'})
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
