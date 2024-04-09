import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Nearby Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to list nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post("/gyms")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: "Test Near Gym",
        description: "Test Description",
        phone: "123456789",
        latitude: -27.5379856,
        longitude: -49.3617558,
      });

    await request(app.server)
      .post("/gyms")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: "Test Far Gym",
        description: "Test Description",
        phone: "123456789",
        latitude: -22.4359235,
        longitude: -46.7760536,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -27.5379856,
        longitude: -49.3617558,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    console.log(response);

    expect(response.statusCode).toBe(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Test Near Gym",
      }),
    ]);
  });
});
