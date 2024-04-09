import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../middlewares/verify-jwt";

export const gymsRoutes = async (app: FastifyInstance) => {
  app.addHook("onRequest", verifyJwt);
};
