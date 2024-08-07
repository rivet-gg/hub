import { GameSelect } from "@/domains/game/components/game-select";
import { useDialog } from "@/hooks/use-dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  createSchemaForm,
} from "@rivet-gg/components";
import { type UseFormReturn, useFormContext } from "react-hook-form";
import z from "zod";

export const formSchema = z.object({
  gameId: z.string().min(1, "Required"),
  token: z.string(),
});

export type FormValues = z.infer<typeof formSchema>;
export type SubmitHandler = (
  values: FormValues,
  form: UseFormReturn<FormValues>,
) => Promise<void>;

const { Form, Submit, Reset } = createSchemaForm(formSchema);
export { Form, Submit, Reset };

export const Game = () => {
  const { control, setValue } = useFormContext<FormValues>();
  const { dialog, open, close } = useDialog.CreateGame({
    onSuccess: (data) => {
      setValue("gameId", data.gameId);
      close();
    },
  });

  return (
    <>
      {dialog}
      <FormField
        control={control}
        name="gameId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Game</FormLabel>
            <GameSelect
              showCreateGame
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={`${field.value}`}
              onCreateClick={open}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export const Token = ({ value }: { value: string }) => {
  const { register } = useFormContext<FormValues>();
  return <input type="hidden" {...register("token", { value })} />;
};
