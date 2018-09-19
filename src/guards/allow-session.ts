import { ReflectMetadata } from "@nestjs/common";

export const AllowSessions = (...sessions) => ReflectMetadata("allowedSessions", sessions);
