import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Rotas de perfil: ", () => {

  beforeAll(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  })

  it("Deve ser possível listar todas as informações do usuário: ", async () => {
    const mockUser = {
      name: "teste",
      email: "emailTeste",
      password: "123",
    };

    await createUserUseCase.execute(mockUser);

    const user = await usersRepositoryInMemory.findByEmail("emailTeste");

    const userData = await showUserProfileUseCase.execute(`${user?.id}`);

    expect(userData).toHaveProperty("name");
  });

  it("Não deve ser possível listar as informações de um usuário não existente: ", async () => {
    const ShowUserProfileError = { message: "User not found", statusCode: 404 };

    await expect(showUserProfileUseCase.execute("userIdNaoExistente")).rejects.toEqual(ShowUserProfileError);
  });
});
