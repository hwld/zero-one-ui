import { HttpResponse, delay, http } from "msw";
import { z } from "zod";
import { Event, eventSchema, eventStore } from "./event-store";
import { isSameMinute } from "date-fns";
import { fetcher } from "../../../lib/fetcher";

const CalendarAPI = {
  base: "/calendar/api",
  events: () => `${CalendarAPI.base}/events`,
  event: (id?: string) => `${CalendarAPI.events()}/${id ?? ":id"}`,
};

// 今のところcreateInputとupdateInputは同じなのでこれを使う。
// 別々にしたくなったタイミングで(create|update)EventInputSchemaを変更する
type EventInputSchemaKeys = "title" | "allDay" | "start" | "end";
export const eventInputSchema = z
  .object({
    title: z
      .string()
      .min(1, "タイトルを入力してください")
      .max(200, "タイトルは200文字以下で入力してください"),
    allDay: z.boolean(),
    start: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
    end: z.union([z.string(), z.date()]).pipe(z.coerce.date()),
  } satisfies Record<EventInputSchemaKeys, unknown>)
  .refine(
    (input) => {
      return input.start.getTime() <= input.end.getTime();
    },
    {
      path: ["start"] satisfies EventInputSchemaKeys[],
      error: "開始日時は終了日時より前に設定してください",
    },
  )
  .refine(
    (input) => {
      if (input.allDay) {
        return true;
      }
      return !isSameMinute(input.start, input.end);
    },
    {
      path: ["end"] satisfies EventInputSchemaKeys[],
      error: "開始日時と異なる日時を設定してください",
    },
  );
export type EventInput = z.infer<typeof eventInputSchema>;

const createEventInputSchema = eventInputSchema;
export type CreateEventInput = z.infer<typeof createEventInputSchema>;

const updateEventInputSchema = eventInputSchema;
export type UpdateEventInput = z.infer<typeof updateEventInputSchema>;

export const fetchEvents = async (): Promise<Event[]> => {
  const res = await fetcher.get(CalendarAPI.events());
  const json = await res.json();
  const events = z.array(eventSchema).parse(json);

  return events;
};

export const createEvent = async (input: CreateEventInput): Promise<Event> => {
  const res = await fetcher.post(CalendarAPI.events(), { body: input });
  const json = await res.json();
  const event = eventSchema.parse(json);

  return event;
};

export const updateEvent = async ({
  id,
  ...input
}: UpdateEventInput & { id: string }): Promise<Event> => {
  const res = await fetcher.put(CalendarAPI.event(id), { body: input });
  const json = await res.json();
  const event = eventSchema.parse(json);

  return event;
};

export const deleteEvent = async (id: string): Promise<void> => {
  await fetcher.delete(CalendarAPI.event(id));
  return;
};

export const calendarApiHandlers = [
  http.get(CalendarAPI.events(), async () => {
    await delay();

    const events = eventStore.getAll();
    return HttpResponse.json(events);
  }),

  http.get(CalendarAPI.event(), async ({ params }) => {
    await delay();

    const id = z.string().parse(params.id);
    const event = eventStore.get(id);

    if (!event) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(event);
  }),

  http.post(CalendarAPI.events(), async ({ request }) => {
    await delay();

    const body = await request.json();
    const input = createEventInputSchema.parse(body);
    const createdEvent = eventStore.add(input);

    return HttpResponse.json(createdEvent);
  }),

  http.put(CalendarAPI.event(), async ({ params, request }) => {
    await delay();

    const eventId = z.string().parse(params.id);
    const body = await request.json();
    const input = updateEventInputSchema.parse(body);
    const updatedEvent = eventStore.update({ ...input, id: eventId });

    if (!updatedEvent) {
      throw new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(updatedEvent);
  }),

  http.delete(CalendarAPI.event(), async ({ params }) => {
    await delay();

    const id = z.string().parse(params.id);
    eventStore.remove(id);

    return HttpResponse.json({});
  }),
];
