import { GroupSelect } from "@/domains/group/components/group-select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  createSchemaForm,
} from "@rivet-gg/components";
import { type UseFormReturn, useFormContext } from "react-hook-form";
import z from "zod";
import * as GroupCreateGameForm from "./group-create-game-form";

export const formSchema = z.intersection(
  z.object({ developerGroupId: z.string().min(1, "Required") }),
  GroupCreateGameForm.formSchema,
);

export type FormValues = z.infer<typeof formSchema>;
export type SubmitHandler = (
  values: FormValues,
  form: UseFormReturn<FormValues>,
) => Promise<void>;

const { Form, Submit } = createSchemaForm(formSchema);
export { Form, Submit };

export const Name = GroupCreateGameForm.Name;
export const Slug = GroupCreateGameForm.Slug;

export const Group = () => {
  const { control } = useFormContext<FormValues>();
  return (
    <FormField
      control={control}
      name="developerGroupId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Team</FormLabel>
          <GroupSelect
            onValueChange={field.onChange}
            value={field.value}
            defaultValue={`${field.value}`}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
