import { z } from "zod";
import { CreateEventInput, UpdateEventInput } from "./api";
import { addHours } from "date-fns";

export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  allDay: z.boolean(),
  start: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
  end: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
});
export type Event = z.infer<typeof eventSchema>;

export type EventStoreErrorSimulationScope = "query" | "mutation";

class EventStore {
  private events: Event[] = [
    {
      id: crypto.randomUUID(),
      title: "Event",
      allDay: false,
      start: new Date(),
      end: addHours(new Date(), 3),
    },
  ];
  private errorSimuationScopes: Set<EventStoreErrorSimulationScope> = new Set();

  private throwErrorForScopes(scope: EventStoreErrorSimulationScope) {
    if (this.errorSimuationScopes.has(scope)) {
      throw new Error("simulated error");
    }
  }

  public getAll(): Event[] {
    this.throwErrorForScopes("query");

    return this.events;
  }

  public get(id: string): Event | undefined {
    this.throwErrorForScopes("query");

    return this.events.find((e) => e.id === id);
  }

  public add(input: CreateEventInput): Event {
    this.throwErrorForScopes("mutation");

    const addedEvent: Event = {
      id: crypto.randomUUID(),
      title: input.title,
      allDay: input.allDay,
      start: input.start,
      end: input.end,
    };
    this.events = [...this.events, addedEvent];

    return addedEvent;
  }

  public update(input: UpdateEventInput & { id: string }): Event | undefined {
    this.throwErrorForScopes("mutation");

    this.events = this.events.map((event) => {
      if (event.id === input.id) {
        return {
          ...event,
          title: input.title,
          allDay: input.allDay,
          start: input.start,
          end: input.end,
        };
      }
      return event;
    });

    const updatedEvent = this.events.find((e) => e.id === input.id);
    return updatedEvent;
  }

  public remove(id: string) {
    this.throwErrorForScopes("mutation");

    this.events = this.events.filter((e) => e.id !== id);
  }

  public setErrorSimulationScope(scope: EventStoreErrorSimulationScope, enable: boolean) {
    if (enable) {
      this.errorSimuationScopes.add(scope);
    } else {
      this.errorSimuationScopes.delete(scope);
    }
  }

  public stopErrorSimulation() {
    this.errorSimuationScopes.clear();
  }
}

export const eventStore = new EventStore();
