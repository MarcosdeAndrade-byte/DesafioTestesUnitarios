import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statementRepo: InMemoryStatementsRepository;
let userRepo: InMemoryUsersRepository;

let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;


describe("Rota de Saldo", () => {
  beforeAll(() => {
    statementRepo = new InMemoryStatementsRepository();
    userRepo = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(userRepo);
    getBalanceUseCase = new GetBalanceUseCase(statementRepo, userRepo);
    createStatementUseCase = new CreateStatementUseCase(userRepo, statementRepo);
  })

  it("Deve ser possível listar todas as operações de deposito e saque do usuário: ", async () => {
    await createUserUseCase.execute({name: "Marcos", email: "m123", password: "123"});
    const user = await userRepo.findByEmail("m123");
    const statement = await createStatementUseCase.execute({user_id: user?.id, type: "Deposit", amount: 200, description: "Descrição"} as any);
    const extract = await getBalanceUseCase.execute({user_id: statement.user_id})
    expect(extract).toHaveProperty("balance");
  });

  it("Não deve ser possível listar todas as operações de deposito e saque de um usuário inválido:", async () => {
    await expect(getBalanceUseCase.execute({user_id: "idInvalido"})).rejects.toEqual(new GetBalanceError());
  });
})
