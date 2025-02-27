import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const response = await request(app.server)
      .post("/gyms")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: "Test Gym",
        description: "Test Description",
        phone: "123456789",
        latitude: -27.5379856,
        longitude: -49.3617558,
      });

    expect(response.statusCode).toBe(201);
  });
});
