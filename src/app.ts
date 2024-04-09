import fastify from "fastify";
import { usersRoutes } from "./http/controllers/users/routes";
import { ZodError } from "zod";
import { env } from "./env";
import { fastifyJwt } from "@fastify/jwt";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { checkInsRoutes } from "./http/controllers/check-ins/routes";
import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";

export const app = fastify();
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: { expiresIn: "10m" },
});
app.register(fastifyCookie);
app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.register(cors, {
  origin: true,
  credentials: true,
});

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error", issues: error.issues });
  }

  if (env.NODE_ENV !== "prod") {
    console.error(error);
  } else {
    // Here we can send the error to a service like Sentry/Datadog/New Relic/etc
  }

  return reply.status(500).send({ message: "Internal server error" });
});
