import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInService } from "./check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInService;

describe("Get User Profile Service", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInService(checkInsRepository);
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  //   it("should not be able to check in", async () => {
  //     await expect(
  //       sut.execute({
  //         userId: "wrong-id",
  //         gymId: "wrong-id",
  //       })
  //     ).rejects.toBeInstanceOf(ResourceNotFoundError);
  //   });
});
