import { prisma } from "@/lib/prisma";
import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";

interface RegisterProps {
  name: string;
  email: string;
  password: string;
}
export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterProps) {
    const password_hash = await hash(password, 6);
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new Error("User already exists");
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}
