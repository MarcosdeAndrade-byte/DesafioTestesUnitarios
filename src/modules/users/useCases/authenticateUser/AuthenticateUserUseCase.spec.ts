import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Rota de login", () => {
  beforeAll(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it("Deve ser possível fazer login:", async () => {
    const mockUser = {
      name: "Ana",
      email: "ana.clara@email.com",
      password: "1234",
    }

    await createUserUseCase.execute(mockUser);

    const userData = await authenticateUserUseCase.execute({email: "ana.clara@email.com", password: "1234"});

    expect(userData).toHaveProperty("token");
  });

  it("Não deve ser possível fazer login em uma conta não existente: ", async () => {
    await expect(authenticateUserUseCase.execute({email: "user.nor@exist.com", password: "1234"})).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possível fazer login com uma senha inválida: ", async () => {
    await expect(authenticateUserUseCase.execute({email: "ana.clara@email.com", password: "senhaInvalida"})).rejects.toBeInstanceOf(AppError);
  });
})
