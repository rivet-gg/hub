import { Button, type ButtonProps, Form } from "@rivet-gg/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ComponentProps, type ReactNode, useEffect } from "react";
import {
  type DefaultValues,
  type FieldPath,
  type FieldValues,
  type PathValue,
  useForm,
  useFormContext,
  type UseFormReturn,
  useFormState,
} from "react-hook-form";
import type z from "zod";

interface FormProps<FormValues extends FieldValues> extends Omit<ComponentProps<"form">, "onSubmit"> {
  onSubmit: SubmitHandler<FormValues>;
  defaultValues: DefaultValues<FormValues>;
  children: ReactNode;
}

type SubmitHandler<FormValues extends FieldValues> = (
  values: FormValues,
  form: UseFormReturn<FormValues>,
) => Promise<void> | void;

export const createSchemaForm = <Schema extends z.ZodSchema>(
  schema: Schema,
) => {
  return {
    Form: ({
      defaultValues,
      children,
      onSubmit,
      ...props
    }: FormProps<z.TypeOf<Schema>>) => {
      const form = useForm<z.TypeOf<Schema>>({
        reValidateMode: "onSubmit",
        resolver: zodResolver(schema),
        defaultValues,
      });

      return (
        <Form {...form}>
          <form
            {...props}
            onSubmit={(event) => {
              event.stopPropagation();
              return form.handleSubmit((values) => onSubmit(values, form), console.error)(
                event,
              );
            }}
            className="contents"
          >
            {children}
          </form>
        </Form>
      );
    },
    Submit: (props: ButtonProps) => {
      const { isSubmitting, isValidating, isDirty } = useFormState<z.TypeOf<Schema>>();
      return (
        <Button
          type="submit"
          disabled={!isDirty}
          isLoading={isSubmitting || isValidating}
          {...props}
        />
      );
    },
    Reset: (props: ButtonProps) => {
      const { defaultValues, isDirty } = useFormState<z.TypeOf<Schema>>();
      const { reset } = useFormContext<z.TypeOf<Schema>>();
      return (
        <Button
          type="button"
          disabled={!isDirty}
          onClick={() => reset(defaultValues)}
          {...props}
        />
      );
    },
    SetValue: <Path extends FieldPath<z.TypeOf<Schema>>>(
      props: { name: Path; value: PathValue<z.TypeOf<Schema>, Path> },
    ) => {
      const { setValue } = useFormContext<z.TypeOf<Schema>>();
      useEffect(() => {
        setValue(props.name, props.value, { shouldDirty: true });
      }, [props.name, setValue, props.value]);
      return null;
    },
    useContext: () => useFormContext<z.TypeOf<Schema>>(),
  };
};
