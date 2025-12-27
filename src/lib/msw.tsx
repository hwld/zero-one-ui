import { todo2Handlers } from "../app/todo-2/_backend/api";
import { githubProjcetApiHandler } from "../app/github-project/_backend/api";
import { calendarApiHandlers } from "../app/calendar/_backend/api";
import { todoistApiHandler } from "../app/todoist/_backend/api";
import { todo1Handlers } from "../app/todo-1/_backend/api";
import { setupWorker } from "msw/browser";
import type { RequestHandler } from "msw";

export const setupMsw = async () => {
  const handlers: RequestHandler[] = [
    ...todo1Handlers,
    ...todo2Handlers,
    ...githubProjcetApiHandler,
    ...calendarApiHandlers,
    ...todoistApiHandler,
  ];
  const worker = setupWorker(...handlers);
  await worker.start({
    onUnhandledRequest: "bypass",
  });
};
