import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { ValidateCheckInService } from "../validate-check-in";

export function makeValidateCheckInService(): ValidateCheckInService {
  const checkinsRepository = new PrismaCheckInsRepository();
  const service = new ValidateCheckInService(checkinsRepository);

  return service;
}
