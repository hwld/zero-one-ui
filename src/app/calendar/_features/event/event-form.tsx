import {
  forwardRef,
  ComponentPropsWithoutRef,
  ReactNode,
  useMemo,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { IconType } from "@react-icons/all-files/lib";
import { TbTextCaption } from "@react-icons/all-files/tb/TbTextCaption";
import { TbClockHour5 } from "@react-icons/all-files/tb/TbClockHour5";
import { TbAlertCircle } from "@react-icons/all-files/tb/TbAlertCircle";
import { EventInput, eventInputFormSchema } from "../../_backend/api";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addMinutes,
  differenceInMinutes,
  format,
  parse,
  startOfDay,
} from "date-fns";
import { DragDateRange } from "../../utils";
import { cn } from "../../../../lib/utils";

export const EVENT_FORM_ID = "event-form-id";

// input[type="date"|"datetime-locale"]に合わせる
const getDateFormatString = (allDay: boolean = false) => {
  if (allDay) {
    return "yyyy-MM-dd";
  } else {
    return "yyyy-MM-dd'T'HH:mm";
  }
};

type Props = {
  onChangeEventPeriodPreview?: Dispatch<
    SetStateAction<DragDateRange | undefined>
  >;
  onSubmit: (input: EventInput) => void;
  defaultValues: EventInput;
  isPending?: boolean;
};

export const EventForm: React.FC<Props> = ({
  onChangeEventPeriodPreview,
  onSubmit,
  isPending,
  defaultValues: _defaultValues,
}) => {
  const [defaultValues] = useState(_defaultValues);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(eventInputFormSchema),
  });
  const isAllDay = useWatch({ control, name: "allDay" });

  const handleSubmitEvent = handleSubmit((data) => {
    if (isPending) {
      return;
    }

    const startDate = data.allDay ? startOfDay(data.start) : data.start;
    const endDate = data.allDay ? startOfDay(data.end) : data.end;

    onSubmit({
      ...data,
      start: startDate,
      end: endDate,
    });
  });

  const handleChangePeriodStart = (newStart: Date) => {
    const oldStart = getValues("start");
    const oldEnd = getValues("end");

    const diffMinutes = differenceInMinutes(newStart, oldStart);
    const nweEnd = addMinutes(oldEnd, diffMinutes);

    onChangeEventPeriodPreview?.((preview) => {
      if (!preview) {
        return undefined;
      }
      return {
        ...preview,
        dragEndDate: nweEnd,
        dragStartDate: newStart,
      };
    });

    setValue("start", newStart);
    setValue("end", nweEnd);
  };

  const handleChangePeriodEnd = (newEnd: Date) => {
    let newStart = getValues("start");

    if (newEnd.getTime() < newStart.getTime()) {
      newStart = newEnd;
    }

    onChangeEventPeriodPreview?.((preview) => {
      if (!preview) {
        return undefined;
      }

      return {
        ...preview,
        dragStartDate: newStart,
        dragEndDate: newEnd,
      };
    });

    setValue("start", newStart);
    setValue("end", newEnd);
  };

  return (
    <form
      id={EVENT_FORM_ID}
      onSubmit={handleSubmitEvent}
      className="flex flex-col gap-4"
    >
      <FormField icon={TbTextCaption} error={errors.title?.message}>
        <Input
          placeholder="タイトルを入力してください..."
          autoFocus
          error={!!errors.title}
          {...register("title")}
        />
      </FormField>
      <FormField
        icon={TbClockHour5}
        error={errors.start?.message ?? errors.end?.message}
        option={
          <div className="flex shrink-0 gap-1">
            <input id="allDay" type="checkbox" {...register("allDay")} />
            <label htmlFor="allDay" className="text-sm select-none">
              終日
            </label>
          </div>
        }
      >
        <div className="flex w-full items-center gap-2">
          <Controller
            control={control}
            name="start"
            render={({ field: { onChange: _, ...otherField }, fieldState }) => {
              return (
                <DateInput
                  isAllDay={isAllDay}
                  error={!!fieldState.error}
                  onChange={handleChangePeriodStart}
                  {...otherField}
                />
              );
            }}
            defaultValue={defaultValues.start}
          />
          <div className="text-xs">〜</div>
          <Controller
            control={control}
            name="end"
            render={({ field: { onChange: _, ...otherField }, fieldState }) => {
              return (
                <DateInput
                  isAllDay={isAllDay}
                  error={!!fieldState.error}
                  onChange={handleChangePeriodEnd}
                  {...otherField}
                />
              );
            }}
            defaultValue={defaultValues.end}
          />
        </div>
      </FormField>
    </form>
  );
};

type InputProps = { error?: boolean } & ComponentPropsWithoutRef<"input">;
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      {...props}
      className={cn(
        "h-8 w-full rounded-sm border bg-neutral-50 px-2 text-sm placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:outline-hidden",
        error
          ? "border-red-600 ring-red-600"
          : "border-neutral-300 ring-neutral-500",
        className,
      )}
    />
  );
});

const DateInput = forwardRef<
  HTMLInputElement,
  Omit<InputProps, "value" | "onChange"> & {
    isAllDay: boolean;
    value: Date;
    onChange: (date: Date) => void;
  }
>(function DateInput({ isAllDay, value, onChange, ...props }, ref) {
  const valueStr = useMemo(() => {
    if (!value) {
      return "";
    }

    return format(value, getDateFormatString(isAllDay));
  }, [isAllDay, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = parse(
      e.target.value,
      getDateFormatString(isAllDay),
      new Date(),
    );

    if (isNaN(date.getTime())) {
      onChange(new Date());
    } else {
      onChange(date);
    }
  };

  return (
    <Input
      ref={ref}
      value={valueStr}
      onChange={handleChange}
      type={isAllDay ? "date" : "datetime-local"}
      {...props}
    />
  );
});

const FormField: React.FC<{
  icon: IconType;
  children: ReactNode;
  option?: ReactNode;
  error?: string;
}> = ({ icon, children, option, error }) => {
  const Icon = icon;
  return (
    <div className="space-y-2">
      <div className="flex w-full items-center gap-2">
        <Icon size={20} className="shrink-0 text-neutral-700" />
        {children}
      </div>
      {(option || error) && (
        <div className="flex gap-2">
          <div className="size-[20px]" />
          {option}
          {error && (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <TbAlertCircle size={16} />
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
