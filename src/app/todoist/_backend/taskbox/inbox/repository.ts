import { taskRepository } from "../../task/repository";
import { initialData } from "./data";
import { type Inbox, type InboxDetail } from "./model";

export type InboxRecord = { taskboxId: string };

class InboxRepository {
  private inbox: InboxRecord = initialData;

  public get = (): Inbox => {
    const taskCount = taskRepository.getManyByTaskboxId(this.inbox.taskboxId).length;

    return { taskboxId: this.inbox.taskboxId, taskCount: taskCount };
  };

  public getDetail = (): InboxDetail => {
    const summary = this.get();
    const inboxTasks = taskRepository.getManyByTaskboxId(summary.taskboxId);

    const detail: InboxDetail = {
      taskboxId: summary.taskboxId,
      taskCount: summary.taskCount,
      tasks: inboxTasks,
    };

    return detail;
  };
}

export const inboxRepository = new InboxRepository();
