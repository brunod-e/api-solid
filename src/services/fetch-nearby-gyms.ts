import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";

interface FetchNearbyGymsServiceProps {
  userLatitude: number;
  userLongitude: number;
}

interface FetchNearbyGymsServiceResponse {
  gyms: Gym[];
}
export class FetchNearbyGymsService {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsServiceProps): Promise<FetchNearbyGymsServiceResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return { gyms };
  }
}
