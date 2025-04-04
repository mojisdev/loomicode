import { z } from "zod";

export interface LoomContext<TOptionsSchema extends z.ZodType> {
  options: TOptionsSchema["_input"];
}

export interface LoomConfig<
  TInputSchema extends z.ZodType,
  TOptionsSchema extends z.ZodType,
> {
  inputSchema: TInputSchema;
  optionsSchema: TOptionsSchema;
  template: (
    ctx: LoomContext<TOptionsSchema>,
    item: TInputSchema["_input"]
  ) => string;
}

export interface LoomInstance<
  TInputSchema extends z.ZodType,
  TOptionsSchema extends z.ZodType,
> {
  (options: TOptionsSchema["_input"] & { input: TInputSchema["_input"][] }): string;
}

export function createLoom<
  TInputSchema extends z.ZodType,
  TOptionsSchema extends z.ZodType,
>(config: LoomConfig<TInputSchema, TOptionsSchema>): LoomInstance<TInputSchema, TOptionsSchema> {
  return (options) => {
    // Validate options against schema
    const validatedOptions = config.optionsSchema.parse(options);

    // Validate input against schema
    const validatedInput = z.array(config.inputSchema).parse(options.input);

    // Create context for template
    const ctx: LoomContext<TOptionsSchema> = {
      options: validatedOptions,
    };

    // Generate output for each item
    const lines: string[] = [];

    for (const item of validatedInput) {
      lines.push(config.template(ctx, item));
    }

    return lines.join("\n");
  };
}
