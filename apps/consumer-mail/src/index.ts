import { start, installProcessGuards } from "@/app/runtime";
import logger from "@/utils/logger";

installProcessGuards();

start().catch((error) => {
    logger.fatal(error);
    process.exit(1);
});
