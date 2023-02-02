import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Rotas do usuário: ", () => {

  beforeAll(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it("Deve ser possível criar um usuário:", async () => {
    const mockUser = {
      name: "teste",
      email: "emailTeste",
      password: "123",
    }

    const user = await createUserUseCase.execute(mockUser);
    expect(user).toHaveProperty("email");
  });

  it("Não deve ser possível criar um usuário duplicado:", async () => {
    const mockUser = {
      name: "teste",
      email: "emailTeste",
      password: "123",
    }

    await expect(createUserUseCase.execute(mockUser)).rejects.toBeInstanceOf(AppError);
  });
});
