import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsService } from "./get-user-metrics";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsService;

describe("Get User Metrics Service", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsService(checkInsRepository);
  });

  it("should be able to get check-ins count from metrics", async () => {
    await checkInsRepository.create({
      user_id: "user-id",
      gym_id: "gym-id-1",
    });

    await checkInsRepository.create({
      user_id: "user-id",
      gym_id: "gym-id-2",
    });

    const { checkInsCount } = await sut.execute({
      userId: "user-id",
    });

    expect(checkInsCount).toEqual(2);
  });
});
