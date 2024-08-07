import * as React from "react";

import { faCheck, faChevronDown } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "../lib/utils";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface Option {
  label: React.ReactNode;
  value: string;
}

export interface ComboboxProps {
  options: (
    | Option
    | { heading: React.ReactNode; key: string; options: Option[] }
  )[];
  placeholder?: string;
  notFoundMessage?: string;
  className?: string;
  onValueChange: (value: string) => void;
  value: string;
}

export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    { options, placeholder, notFoundMessage, className, value, onValueChange },
    ref,
  ) => {
    const [open, onOpenChange] = React.useState(false);

    const flatOptions = options.flatMap((option) => {
      if ("value" in option) {
        return [option];
      }

      return option.options;
    });

    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("justify-between", className)}
          >
            {value
              ? flatOptions.find((option) => option.value === value)?.label
              : placeholder}

            <FontAwesomeIcon
              className="ml-2 h-4 w-4 shrink-0 opacity-50"
              icon={faChevronDown}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandEmpty>{notFoundMessage}</CommandEmpty>
            <CommandList>
              {options.map((option) => {
                if ("heading" in option) {
                  return (
                    <ComboboxOptionGroup
                      key={option.key}
                      heading={option.heading}
                      options={option.options}
                      value={value}
                      onValueChange={onValueChange}
                      onOpenChange={onOpenChange}
                    />
                  );
                }
                return (
                  <ComboboxOption
                    key={option.value}
                    option={option}
                    value={value}
                    onValueChange={onValueChange}
                    onOpenChange={onOpenChange}
                  />
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

interface ComboboxOptionProps {
  option: Option;
  value: string;
  onValueChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
}

function ComboboxOption({
  option,
  value,
  onValueChange,
  onOpenChange,
}: ComboboxOptionProps) {
  return (
    <CommandItem
      key={option.value}
      value={option.value}
      keywords={[option.value]}
      onSelect={(currentValue) => {
        onValueChange(currentValue === value ? "" : currentValue);
        onOpenChange(false);
      }}
    >
      <FontAwesomeIcon
        icon={faCheck}
        className={cn(
          "mr-2 h-4 w-4",
          value === option.value ? "opacity-100" : "opacity-0",
        )}
      />
      {option.label}
    </CommandItem>
  );
}

interface ComboboxOptionGroupProps {
  heading: React.ReactNode;
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
}

function ComboboxOptionGroup({
  heading,
  options,
  value,
  onValueChange,
  onOpenChange,
}: ComboboxOptionGroupProps) {
  return (
    <CommandGroup heading={heading}>
      {options.map((option) => (
        <ComboboxOption
          key={option.value}
          option={option}
          value={value}
          onValueChange={onValueChange}
          onOpenChange={onOpenChange}
        />
      ))}
    </CommandGroup>
  );
}
