import { createReactQueryHooks } from "@trpc/react";
import { AppRouter } from "../server/route/app.router";

//add appRouter Generic soon
export const trpc = createReactQueryHooks<AppRouter>();
