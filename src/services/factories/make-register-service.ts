import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterService } from "../register";

export function makeRegisterService(): RegisterService {
  const usersRepository = new PrismaUsersRepository();
  const registerService = new RegisterService(usersRepository);

  return registerService;
}
