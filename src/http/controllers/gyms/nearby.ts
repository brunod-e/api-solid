import { makeFetchNearbyGymsService } from "@/services/factories/make-fetch-nearby-gyms-service";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export const nearby = async (req: FastifyRequest, reply: FastifyReply) => {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.number().refine(value => Math.abs(value) <= 90),
    longitude: z.number().refine(value => Math.abs(value) <= 180),
  });

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(req.query);

  const nearbyService = makeFetchNearbyGymsService();

  const { gyms } = await nearbyService.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send({
    gyms,
  });
};
