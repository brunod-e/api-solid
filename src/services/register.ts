import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

interface RegisterProps {
    name: string
    email: string
    password: string
}

export async function registerService({
    name,
    email,
    password
}: RegisterProps) {
    const password_hash = await hash(password, 6)

    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    })
  
    if (userAlreadyExists) {
      throw new Error("User already exists")
    }
  
    await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
      },
    })
}