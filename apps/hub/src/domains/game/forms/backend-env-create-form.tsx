import {
  safeAsyncValidation,
  validateAgainstApi,
} from "@/lib/async-validation";
import { convertStringToId } from "@/lib/utils";
import { rivetEeClient } from "@/queries/global";
import { Rivet as RivetEe } from "@rivet-gg/api-ee";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  createSchemaForm,
} from "@rivet-gg/components";
import { type UseFormReturn, useFormContext } from "react-hook-form";
import z from "zod";

export const formSchema = z
  .object({
    name: z.string().max(25),
    slug: z.string().max(25).optional(),
    tier: z.union([
      z.literal(RivetEe.ee.backend.Tier.Dedicated),
      z.literal(RivetEe.ee.backend.Tier.Shared),
    ]),
    projectId: z.string(),
  })
  .superRefine(async (arg, ctx) => {
    await safeAsyncValidation(ctx, async () => {
      const res = await rivetEeClient.ee.cloud.backend.projects.envs.validate(
        arg.projectId,
        {
          displayName: arg.name,
          nameId: arg.slug || convertStringToId(arg.name),
        },
      );

      validateAgainstApi({
        group: "GAME_NAMESPACE",
        errors: res.errors,
      }).setSchemaIssues(ctx, {
        name: "display-name",
        slug: "name-id",
      });
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
            <Input
              placeholder="Enter a environment name..."
              maxLength={25}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const Slug = () => {
  const { control, watch } = useFormContext<FormValues>();

  const name = watch("name");

  return (
    <FormField
      control={control}
      name="slug"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Slug</FormLabel>
          <FormControl>
            <Input
              placeholder={name ? convertStringToId(name) : "Enter a slug..."}
              maxLength={25}
              {...field}
              onChange={(event) => {
                const value = event.target.value
                  .replace(/[\s-]+/g, "-")
                  .toLowerCase();
                field.onChange({ target: { value } });
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const Tier = () => {
  const { control } = useFormContext<FormValues>();
  return (
    <FormField
      control={control}
      name="tier"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tier</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={`${field.value}`}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(RivetEe.ee.backend.Tier).map(([label, value]) => (
                <SelectItem key={value} value={`${value}`}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>This can't be changed later.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
