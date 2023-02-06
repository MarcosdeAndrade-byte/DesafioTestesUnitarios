import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "../getBalance/GetBalanceError";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Deve ser possível listar os dados de movimentação da conta: ", async () => {
    const { id } = await createUserUseCase.execute({
      name: "Ana",
      email: "test@example.com",
      password: "sjsslphs",
    });

    await createStatementUseCase.execute({
      user_id: id as string,
      type: "deposit" as any,
      amount: 1000,
      description: "descricao",
    });

    const balance = await getBalanceUseCase.execute({ user_id: id as string });

    expect(balance).toHaveProperty("balance");
  });

  it("Não de ve ser possível sacar dinheiro de uma conta não existente: ", async () => {
    expect(async() => {
      await getBalanceUseCase.execute({user_id: "IdNaoExistente"});

    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
