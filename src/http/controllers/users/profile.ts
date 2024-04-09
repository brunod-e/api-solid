import { makeGetUserProfileService } from "@/services/factories/make-get-user-profile-service";
import { FastifyRequest, FastifyReply } from "fastify";

export const profile = async (req: FastifyRequest, reply: FastifyReply) => {
  const getUserProfile = makeGetUserProfileService();

  const { user } = await getUserProfile.execute({ userId: req.user.sub });

  Reflect.deleteProperty(user, "password_hash");

  return reply.status(200).send({
    user,
  });
};
