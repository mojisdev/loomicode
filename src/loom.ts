import type { LoomConfig, LoomContext, LoomInstance } from "./types";
import { compare } from "compare-versions";
import { z } from "zod";

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
    const ctx: LoomContext<TOptionsSchema> = Object.freeze(buildLoomContext(validatedOptions));

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

function buildLoomContext<TOptionsSchema extends z.ZodType>(options: TOptionsSchema["_input"]): LoomContext<TOptionsSchema> {
  return {
    options,
    isVersionLessThan: (version) => {
      return compare(version, options.version, "<");
    },
    isVersionGreaterThan: (version) => {
      return compare(version, options.version, ">");
    },
    isVersionEqual: (version) => {
      return compare(version, options.version, "=");
    },
    isVersionGreaterThanOrEqual: (version) => {
      return compare(version, options.version, ">=");
    },
    isVersionLessThanOrEqual: (version) => {
      return compare(version, options.version, "<=");
    },
  };
}
