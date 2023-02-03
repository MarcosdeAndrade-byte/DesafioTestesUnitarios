import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let iStatementsRepository: InMemoryStatementsRepository;

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Rota de deposit", () => {
  beforeAll(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    iStatementsRepository = new InMemoryStatementsRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory,iStatementsRepository);
  })

  it("Deve ser possível fazer um deposito: ", async () => {
    const mockUser = {
      name: "teste",
      email: "emailTeste",
      password: "123",
    };

    await createUserUseCase.execute(mockUser);

    const user = await usersRepositoryInMemory.findByEmail("emailTeste");

    const statement = await createStatementUseCase.execute({user_id: user?.id, type: "Deposit", amount: 100, description: "descrição"} as any);

    expect(statement).toHaveProperty("amount");
  });

  it("Não deve ser possível fazer um saque sem user_id válido: ", async () => {
    const teste = {user_id: "userIdInvalido", type: "withdraw", amount: 10, description: "descrição"};

    await expect(createStatementUseCase.execute(teste as any)).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possível fazer um saque sem dinheiro: ", async () => {
    const mockUser = {
      name: "Ana",
      email: "ana32@gmail.com",
      password: "123",
    };

    await createUserUseCase.execute(mockUser);

    const user = await usersRepositoryInMemory.findByEmail("ana32@gmail.com");

    const teste = {user_id: user?.id, type: "withdraw", amount: 10000000000, description: "descrição"};

    await expect(createStatementUseCase.execute(teste as any)).rejects.toBeInstanceOf(AppError);
  });
})
