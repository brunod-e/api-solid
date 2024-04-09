import fastify from "fastify";
import { appRoutes } from "./http/routes";
import { ZodError } from "zod";
import { env } from "./env";
import { fastifyJwt } from "@fastify/jwt";

export const app = fastify();
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});
app.register(appRoutes);

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
