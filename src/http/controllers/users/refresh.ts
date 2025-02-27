import { FastifyRequest, FastifyReply } from "fastify";

export const refresh = async (req: FastifyRequest, reply: FastifyReply) => {
  await req.jwtVerify({
    onlyCookie: true,
  });

  const { role } = req.user;

  const token = await reply.jwtSign(
    {
      role,
    },
    {
      sign: {
        sub: req.user.sub,
      },
    }
  );

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: req.user.sub,
        expiresIn: "7d",
      },
    }
  );

  return reply
    .setCookie("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: true,
    })
    .status(200)
    .send({ token });
};
