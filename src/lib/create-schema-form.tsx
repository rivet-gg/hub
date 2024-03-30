import { Button, ButtonProps } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import {
  useForm,
  DefaultValues,
  UseFormReturn,
  FieldValues,
  useFormState,
  FormProvider,
} from "react-hook-form";
import z from "zod";

interface FormProps<FormValues extends FieldValues> {
  onSubmit: (
    values: FormValues,
    form: UseFormReturn<FormValues>,
  ) => Promise<void>;
  defaultValues: DefaultValues<FormValues> | DefaultValues<FormValues>;
  children: ReactNode;
}

export const createSchemaForm = <Schema extends z.AnyZodObject>(
  schema: Schema,
) => {
  return {
    Form: ({
      defaultValues,
      children,
      onSubmit,
    }: FormProps<z.TypeOf<Schema>>) => {
      const form = useForm<z.TypeOf<Schema>>({
        resolver: zodResolver(schema),
        defaultValues,
      });

      return (
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit((values) => onSubmit(values, form))}
            className="contents"
          >
            {children}
          </form>
        </FormProvider>
      );
    },
    Submit: (props: ButtonProps) => {
      const { isSubmitting } = useFormState<z.TypeOf<Schema>>();
      return <Button type="submit" isLoading={isSubmitting} {...props} />;
    },
  };
};