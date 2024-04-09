import { makeFetchUserCheckInsHistoryService } from "@/services/factories/make-fetch-user-check-ins-history-service";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export const history = async (req: FastifyRequest, reply: FastifyReply) => {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInHistoryQuerySchema.parse(req.query);

  const fetchUserCheckInsService = makeFetchUserCheckInsHistoryService();

  const { checkIns } = await fetchUserCheckInsService.execute({
    userId: req.user.sub,
    page,
  });

  return reply.status(201).send({
    checkIns,
  });
};
