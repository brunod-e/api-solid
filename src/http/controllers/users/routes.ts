import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../middlewares/verify-jwt";

import { register } from "./register";
import { authenticate } from "./authenticate";
import { profile } from "./profile";
import { refresh } from "./refresh";

export const usersRoutes = async (app: FastifyInstance) => {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  app.patch("/token/refresh", refresh);

  // Authenticated routes
  app.get("/me", { onRequest: [verifyJwt] }, profile);
};
