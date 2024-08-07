import { type AnySchemaElement, is } from "./types.ts";

export function convertSchemaToJsonSchema(schema: AnySchemaElement): unknown {
  if (is("unknown", schema)) {
    return {};
  }
  if (is("string", schema)) {
    return { type: "string" };
  }
  if (is("number", schema)) {
    return { type: "integer" };
  }
  if (is("boolean", schema)) {
    return { type: "boolean" };
  }
  if (is("literal", schema)) {
    return {
      type: typeof schema.value === "string" ? "string" : "integer",
      enum: [schema.value],
    };
  }
  if (is("array", schema)) {
    return {
      type: "array",
      items: convertSchemaToJsonSchema(schema.item),
    };
  }
  if (is("record", schema)) {
    return {
      type: "object",
      additionalProperties: convertSchemaToJsonSchema(schema.elementType),
    };
  }
  if (is("nullable", schema)) {
    return convertSchemaToJsonSchema(schema.item);
  }
  if (is("optional", schema)) {
    return convertSchemaToJsonSchema(schema.value);
  }
  if (is("object", schema)) {
    const properties: Record<string, unknown> = {};
    const required = [];
    for (const [key, value] of Object.entries(schema.properties)) {
      properties[key] = convertSchemaToJsonSchema(value);
      if (value.type !== "optional") {
        required.push(key);
      }
    }
    return {
      type: "object",
      properties,
      required,
      additionalProperties: false,
    };
  }
  if (is("union", schema)) {
    return {
      oneOf: schema.items.map(convertSchemaToJsonSchema),
    };
  }
  if (is("intersection", schema)) {
    return {
      allOf: [
        convertSchemaToJsonSchema(schema.left),
        convertSchemaToJsonSchema(schema.right),
      ],
    };
  }
  if (is("date", schema)) {
    return { type: "string", format: "date-time" };
  }
  if (is("never", schema)) {
    return { not: {} };
  }
  return {};
}
