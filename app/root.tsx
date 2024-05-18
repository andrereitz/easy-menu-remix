import { LinksFunction } from "@remix-run/node";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

import styles from './tailwind.css?url';
import { ArrowLeftFromLineIcon } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html>
    <head>
      <title>Oh no!</title>
      <Meta />
      <Links />
    </head>
    <body>
      <div className="flex justify-center text-center">
        <div className="p-4 rounded-md bg-gray-100 max-w-[400px] w-full mt-4">
          {isRouteErrorResponse(error) && (
            <>
              <h1 className="text-primary-default text-xl">
                {error.status} {error.statusText}
              </h1>
              <p>{error.data}</p>
              <Link to="/" className="flex gap-3 mt-5 justify-center"><ArrowLeftFromLineIcon /> Back to home</Link>
            </>
          )}
          {!isRouteErrorResponse(error) && error instanceof Error && (
            <>
              <h1 className="text-primary-default text-xl">
                Error
              </h1>
              <p>The stack trace is:</p>
              <pre>{error.stack}</pre>
              <Link to="/" className="flex gap-3 mt-5 justify-center"><ArrowLeftFromLineIcon /> Back to home</Link>
            </>
          )}
        </div>
      </div>
      <Scripts />
    </body>
  </html>
  );
}
