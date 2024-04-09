import { makeSearchGymsService } from "@/services/factories/make-search-gyms-service";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export const search = async (req: FastifyRequest, reply: FastifyReply) => {
  const searchGymsQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { query, page } = searchGymsQuerySchema.parse(req.query);

  const searchService = makeSearchGymsService();

  const { gyms } = await searchService.execute({
    query,
    page,
  });

  return reply.status(200).send({
    gyms,
  });
};
