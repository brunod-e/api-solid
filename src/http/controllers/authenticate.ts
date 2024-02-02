import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";
import { makeAuthenticateService } from "@/services/factories/make-authenticate-service";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export const authenticate = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(req.body);

  try {
    const authenticateService = makeAuthenticateService();

    await authenticateService.execute({ email, password });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }

  return reply.status(200).send();
};
