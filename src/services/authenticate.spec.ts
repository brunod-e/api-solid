import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateService } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateService;

describe("Authenticate Service", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateService(usersRepository);
  });

  it("should be able to authenticate", async () => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateService(usersRepository);

    await usersRepository.create({
      name: "John Doe",
      email: "john@doe.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "john@doe.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateService(usersRepository);

    await expect(
      sut.execute({
        email: "john@doe.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong email", async () => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateService(usersRepository);

    await usersRepository.create({
      name: "John Doe",
      email: "john@doe.com",
      password_hash: await hash("123456", 6),
    });

    await expect(
      sut.execute({
        email: "john@doe.com",
        password: "123",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
