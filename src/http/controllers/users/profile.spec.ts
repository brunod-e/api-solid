import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import request from "supertest";
import { app } from "../../../app";
import exp from "constants";

describe("Profile (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get user profile", async () => {
    await request(app.server).post("/users").send({
      name: "Teste",
      email: "teste.teste@teste.com",
      password: "123456",
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email: "teste.teste@teste.com",
      password: "123456",
    });

    const { token } = authResponse.body;

    const profileResponse = await request(app.server)
      .get("/me")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send();

    expect(profileResponse.statusCode).toBe(200);
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: "teste.teste@teste.com",
      })
    );
  });
});
