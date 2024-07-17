import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  AutoFormObject,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Flex,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  JsonCode,
  Text,
  WithTooltip,
  cn,
} from "@rivet-gg/components";
import type { Module } from "@rivet-gg/opengb-shared-internals";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { ConfigSchemaContext } from "./config-schema-context";

interface ConfigInputProps {
  moduleName: string;
}

function ConfigInput({ moduleName }: ConfigInputProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={`modules.${moduleName}.config`}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>Configuration</FormLabel>
            <FormControl>
              <JsonCode
                {...field}
                value={field.value}
                onChange={(value) => field.onChange(value)}
              />
            </FormControl>
            <FormMessage>
              Invalid module configuration. Please check the docs for more
              information.
            </FormMessage>
          </FormItem>
        );
      }}
    />
  );
}

interface ConfigInterfaceProps {
  moduleName: string;
}

function ConfigInterface({ moduleName }: ConfigInterfaceProps) {
  const configSchema = useContext(ConfigSchemaContext);

  // config.modules[moduleName].config
  const configShape =
    configSchema?.shape.modules.shape[moduleName]._def.innerType.shape.config;

  if (!configShape) {
    return null;
  }

  return (
    <AutoFormObject
      schema={configShape}
      path={["modules", moduleName, "config"]}
    />
  );
}

interface DeleteModuleButton {
  moduleName: string;
  content: string;
  isDisabled?: boolean;
}

function DeleteModuleButton({
  moduleName,
  content,
  isDisabled,
}: DeleteModuleButton) {
  const { setValue, getValues } = useFormContext();
  return (
    <WithTooltip
      content={content}
      trigger={
        <div>
          <Button
            size="icon"
            type="button"
            variant="destructive-outline"
            disabled={isDisabled}
            onClick={() => {
              const { [moduleName]: moduleToRemove, ...otherModules } =
                getValues("modules");
              setValue("modules", otherModules, { shouldDirty: true });
            }}
          >
            <FontAwesomeIcon icon="trash" />
          </Button>
        </div>
      }
    />
  );
}

interface ModuleCardProps {
  module: Module;
  isRegistryExternal?: boolean;
  dependants: Module[];
}

export function ModuleCard({
  module,
  isRegistryExternal,
  dependants,
}: ModuleCardProps) {
  const { watch, resetField } = useFormContext();
  const isRemoved = watch("modules")[module.name] === undefined;
  return (
    <section className="w-full scroll-mt-16" id={module.name}>
      <Card
        w="full"
        className={cn({
          "border-destructive opacity-40 pointer-events-none": isRemoved,
        })}
      >
        <CardHeader>
          <Flex direction="row" items="center" justify="between">
            <CardTitle>
              {module.config.icon ? (
                <FontAwesomeIcon icon={module.config.icon} className="mr-2" />
              ) : null}
              {module.config.name}
            </CardTitle>
            <Flex gap="2">
              {isRegistryExternal ? (
                <Button
                  variant="outline"
                  type="button"
                  startIcon={<FontAwesomeIcon icon="book" />}
                  asChild
                >
                  <a href={`https://opengb.dev/modules/${module.name}`}>
                    Documentation
                  </a>
                </Button>
              ) : null}

              <DeleteModuleButton
                content={
                  dependants?.length > 0
                    ? `Remove dependants (${dependants.map((m) => m.config.name).join(", ")}) before removing this module`
                    : "Delete module"
                }
                isDisabled={dependants?.length > 0}
                moduleName={module.name}
              />
            </Flex>
          </Flex>

          <CardDescription>
            <p>{module.config.description}</p>
            {dependants?.length > 0 ? (
              <p>
                Dependants: {dependants.map((m) => m.config.name).join(", ")}.
              </p>
            ) : null}
          </CardDescription>
        </CardHeader>
        {module.hasUserConfigSchema ? (
          <CardContent>
            {/* <ConfigInput moduleName={module.name} /> */}
            <ConfigInterface moduleName={module.name} />
          </CardContent>
        ) : null}
      </Card>
      {isRemoved ? (
        <Flex items="center" my="2" gap="2">
          <Text className="text-sm text-destructive">
            You marked this module to be removed.
          </Text>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => {
              resetField(`modules.${module.name}`);
            }}
          >
            Restore
          </Button>
        </Flex>
      ) : null}
    </section>
  );
}
