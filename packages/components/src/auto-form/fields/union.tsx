import { FormControl, FormItem, FormMessage } from "../../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import type * as z from "zod";
import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import type { AutoFormInputComponentProps } from "../types";
import { getBaseSchema } from "../utils";
import AutoFormObject from "./object";
import { useState } from "react";

export default function AutoFormUnion({
  label,
  isRequired,
  field,
  path,
  fieldConfigItem,
  zodItem,
  fieldProps,
}: AutoFormInputComponentProps & { path?: string[] }) {
  const def = (getBaseSchema(zodItem) as unknown as z.ZodUnion<any>)._def;

  const [selected, setSelected] = useState(() => {
    if (field.value === null) {
      return -1;
    }

    const selected = def.options.findIndex((option) => {
      try {
        option.parse(field.value);
        return true;
      } catch {
        return false;
      }
    });

    return selected;
  });

  return (
    <>
      <FormItem>
        <AutoFormLabel
          label={fieldConfigItem?.label || label}
          isRequired={isRequired}
        />
        <FormControl>
          <Select
            onValueChange={(value) => {
              const newSelected = Number.parseInt(value, 10);
              setSelected(newSelected);
              const newConfig = Object.fromEntries(
                Object.keys(def.options[newSelected].shape).map((key) => [
                  key,
                  {},
                ]),
              );
              field.onChange(newConfig);
            }}
            value={`${selected}`}
          >
            <SelectTrigger className={fieldProps.className}>
              <SelectValue
                placeholder={fieldConfigItem.inputProps?.placeholder}
              >
                {selected === -1
                  ? "Select an option"
                  : `Option #${selected + 1}`}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {def.options.map((_, index) => (
                <SelectItem value={`${index}`} key={index}>
                  Option #{index + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
        <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
        <FormMessage />
      </FormItem>
      {selected !== null ? (
        <AutoFormObject schema={def.options[selected]} path={path} />
      ) : null}
    </>
  );
}
