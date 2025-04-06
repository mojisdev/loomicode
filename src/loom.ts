import { z } from "zod";

export interface LoomContext<TOptionsSchema extends z.ZodType> {
  options: TOptionsSchema["_input"];
}

export interface LoomConfig<
  TInputSchema extends z.ZodType,
  TOptionsSchema extends z.ZodType,
> {
  /**
   * The schema of the input data.
   */
  inputSchema: TInputSchema;

  /**
   * The schema of the options.
   */
  optionsSchema: TOptionsSchema;

  /**
   * The template function.
   */
  template: (
    ctx: LoomContext<TOptionsSchema>,
    item: TInputSchema["_input"]
  ) => string;

  /**
   * The predicate function.
   */
  predicate?: (ctx: LoomContext<TOptionsSchema>, item: TInputSchema["_input"]) => boolean;
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
    // validate options against schema
    const validatedOptions = config.optionsSchema.parse(options);

    // validate input against schema
    const validatedInput = z.array(config.inputSchema).parse(options.input);

    // create context for template
    const ctx: LoomContext<TOptionsSchema> = {
      options: validatedOptions,
    };

    // generate output for each item
    const lines: string[] = [];

    for (const item of validatedInput) {
      // if predicate is defined, and returns false, skip this item
      if (config.predicate && !config.predicate(ctx, item)) {
        continue;
      }

      lines.push(config.template(ctx, item));
    }

    return lines.join("\n");
  };
}
