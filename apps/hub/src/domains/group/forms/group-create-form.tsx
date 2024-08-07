import { safeAsyncValidation } from "@/lib/async-validation";
import { TraversableErrors, VALIDATION_ERRORS } from "@/lib/traversable-errors";
import { rivetClient } from "@/queries/global";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  createSchemaForm,
} from "@rivet-gg/components";
import { type UseFormReturn, useFormContext } from "react-hook-form";
import z from "zod";

export const formSchema = z
  .object({
    name: z.string().max(25),
  })
  .superRefine(async (arg, ctx) => {
    await safeAsyncValidation(ctx, async () => {
      const res = await rivetClient.cloud.groups.validate({
        displayName: arg.name,
      });
      const errors = new TraversableErrors(VALIDATION_ERRORS.GROUP);
      errors.load(res.errors.map((e) => e.path));

      if (!errors.isEmpty()) {
        ctx.addIssue({
          path: ["name"],
          code: z.ZodIssueCode.custom,
          message: errors.findFormatted()[0] || "",
        });
      }
    });

    return z.NEVER;
  });

export type FormValues = z.infer<typeof formSchema>;
export type SubmitHandler = (
  values: FormValues,
  form: UseFormReturn<FormValues>,
) => Promise<void>;

const { Form, Submit } = createSchemaForm(formSchema);
export { Form, Submit };

export const Name = () => {
  const { control } = useFormContext<FormValues>();
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter your team name here..." {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
