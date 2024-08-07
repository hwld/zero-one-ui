import { z } from "zod";
import { projectRepository } from "./repository";
import { fetcher } from "@/lib/fetcher";
import { TodoistAPI } from "../routes";
import { delay, http, HttpResponse } from "msw";
import { ProjectSummary, projectSummarySchema } from "./model";

export const fetchProjectSummaries = async (): Promise<ProjectSummary[]> => {
  const res = await fetcher.get(TodoistAPI.projects());
  const json = await res.json();
  const projectSummaries = z.array(projectSummarySchema).parse(json);

  return projectSummaries;
};

export const projectApiHandlers = [
  http.get(TodoistAPI.projects(), async () => {
    await delay();

    const summaries = projectRepository.getAll();
    return HttpResponse.json(summaries);
  }),
];
