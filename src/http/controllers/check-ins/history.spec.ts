import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("History Check In (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to list the history of check-ins", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        title: "Test Gym",
        description: "Test Description",
        phone: "123456789",
        latitude: -27.5379856,
        longitude: -49.3617558,
      },
    });

    await prisma.checkIn.createMany({
      data: [
        {
          user_id: user.id,
          gym_id: gym.id,
        },
        {
          user_id: user.id,
          gym_id: gym.id,
        },
      ],
    });

    const response = await request(app.server)
      .get("/check-ins/history")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        latitude: -27.5379856,
        longitude: -49.3617558,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        user_id: user.id,
        gym_id: gym.id,
      }),
      expect.objectContaining({
        user_id: user.id,
        gym_id: gym.id,
      }),
    ]);
  });
});
