import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Combobox, type ComboboxProps, Flex } from "@rivet-gg/components";
import type { IndexedModule } from "@rivet-gg/opengb-shared-internals";
import { useSuspenseQuery } from "@tanstack/react-query";
import { forwardRef } from "react";
import { registriesQueryOptions } from "../queries";

interface ModulesSelectProps
  extends Omit<ComboboxProps, "options" | "onValueChange"> {
  placeholder?: string;
  onValueChange: (module: { name: string; registry: string }) => void;
}

export const ModulesSelect = forwardRef<HTMLButtonElement, ModulesSelectProps>(
  ({ placeholder, onValueChange, ...props }, ref) => {
    const { data } = useSuspenseQuery(registriesQueryOptions());

    const options = Object.entries(data).map(([slug, registry]) => {
      const options = Object.entries(registry.modules).map(
        ([moduleSlug, module]) => ({
          label: (
            <ModulesSelectOption module={module} moduleSlug={moduleSlug} />
          ),
          value: `${slug}.${moduleSlug}`,
        }),
      );
      return { heading: `${slug} registry`, key: slug, options };
    });

    return (
      <Combobox
        ref={ref}
        className="w-full"
        {...props}
        onValueChange={(value) => {
          const [registry, name] = value.split(".");
          onValueChange({ registry, name });
        }}
        options={options}
        placeholder={placeholder}
        notFoundMessage="No modules found."
      />
    );
  },
);

interface ModulesSelectOptionProps {
  moduleSlug: string;
  module: IndexedModule;
}

function ModulesSelectOption({ module, moduleSlug }: ModulesSelectOptionProps) {
  return (
    <Flex gap="2" asChild>
      <span>
        {module.icon ? (
          <FontAwesomeIcon icon={module.icon} className="w-3 mt-1" />
        ) : null}
        <span className="text-left">
          {module.name ? (
            <span className="flex items-center">
              {module.name}{" "}
              <span className="text-xs font-mono text-muted-foreground ml-1">
                ({moduleSlug})
              </span>
            </span>
          ) : (
            moduleSlug
          )}
          {module.description ? (
            <span className="text-xs text-muted-foreground block">
              {module.description}
            </span>
          ) : null}
        </span>
      </span>
    </Flex>
  );
}
