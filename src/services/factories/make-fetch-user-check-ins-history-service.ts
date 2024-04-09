import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { FetchUserCheckInsHistoryService } from "../fetch-user-check-ins-history";

export function makeFetchUserCheckInsHistoryService(): FetchUserCheckInsHistoryService {
  const checkinsRepository = new PrismaCheckInsRepository();
  const service = new FetchUserCheckInsHistoryService(checkinsRepository);

  return service;
}
