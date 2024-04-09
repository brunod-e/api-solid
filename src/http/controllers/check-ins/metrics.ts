import { makeGetUserMetricsService } from "@/services/factories/make-get-user-metrics-service";
import { FastifyRequest, FastifyReply } from "fastify";

export const metrics = async (req: FastifyRequest, reply: FastifyReply) => {
  const fetchUserCheckInsService = makeGetUserMetricsService();

  const { checkInsCount } = await fetchUserCheckInsService.execute({
    userId: req.user.sub,
  });

  return reply.status(201).send({
    checkInsCount,
  });
};
