import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInService } from "./check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxCheckInsError } from "./errors/max-checkins-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInService;

describe("Check In Service", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInService(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-id",
      title: "Gym",
      description: "Gym description",
      phone: "",
      latitude: -28.0247286,
      longitude: -48.8558898,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userlatitude: -28.0247286,
      userLongitude: -48.8558898,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userlatitude: -28.0247286,
      userLongitude: -48.8558898,
    });

    await expect(() =>
      sut.execute({
        userId: "user-id",
        gymId: "gym-id",
        userlatitude: -28.0247286,
        userLongitude: -48.8558898,
      })
    ).rejects.toBeInstanceOf(MaxCheckInsError);
  });

  it("should be able to check in twice in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userlatitude: -28.0247286,
      userLongitude: -48.8558898,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userlatitude: -28.0247286,
      userLongitude: -48.8558898,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    await gymsRepository.create({
      id: "gym-id-2",
      title: "Gym",
      description: "Gym description",
      phone: "",
      latitude: new Decimal(-28.0247286),
      longitude: new Decimal(-48.8558898),
    });

    await expect(() =>
      sut.execute({
        userId: "user-id",
        gymId: "gym-id-2",
        userlatitude: -27.5379856,
        userLongitude: -49.3617558,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
