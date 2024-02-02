import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";
import { makeRegisterService } from "@/services/factories/make-register-service";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export const register = async (req: FastifyRequest, reply: FastifyReply) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(req.body);

  try {
    const registerService = makeRegisterService();

    await registerService.execute({ name, email, password });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    throw error;
  }

  return reply.status(201).send();
};
