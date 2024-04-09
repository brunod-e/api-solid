import { FastifyRequest, FastifyReply } from "fastify";

export const profile = async (req: FastifyRequest, reply: FastifyReply) => {
  await req.jwtVerify();

  return reply.status(200).send();
};
