import { logger } from "./log.util";

export async function handleError(callback: any, defaultRes?: any) {
  try {
    return await callback();
  } catch (e) {
    logger.error(e);
    return defaultRes;
  }
}
