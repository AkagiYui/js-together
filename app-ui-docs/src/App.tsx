import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  Link,
} from "@tanstack/react-router";

import { ButtonPage } from "./routes/button";
import { CardCounterPage } from "./routes/card-counter";
import { IndexPage } from "./routes/index";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="text-lg font-semibold text-foreground"
          >
            @akagiyui/ui-react
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link
              to="/button"
              className="text-muted-foreground hover:text-foreground"
            >
              Button
            </Link>
            <Link
              to="/card-counter"
              className="text-muted-foreground hover:text-foreground"
            >
              CardCounter
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IndexPage,
});

const buttonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/button",
  component: ButtonPage,
});

const cardCounterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/card-counter",
  component: CardCounterPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  buttonRoute,
  cardCounterRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}