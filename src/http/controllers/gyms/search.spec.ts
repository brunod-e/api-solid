import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to search gyms", async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post("/gyms")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: "Test Gym 1",
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
        title: "Test Gym 2",
        description: "Test Description",
        phone: "123456789",
        latitude: -27.5379856,
        longitude: -49.3617558,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({
        query: "Test Gym 2",
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Test Gym 2",
      }),
    ]);
  });
});
