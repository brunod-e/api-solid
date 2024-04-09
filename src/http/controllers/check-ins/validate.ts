import { makeCheckInService } from "@/services/factories/make-check-in-service";
import { makeValidateCheckInService } from "@/services/factories/make-validate-check-in-service";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export const validate = async (req: FastifyRequest, reply: FastifyReply) => {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = validateCheckInParamsSchema.parse(req.params);

  const validateService = makeValidateCheckInService();

  await validateService.execute({
    checkInId,
  });

  return reply.status(204).send();
};
