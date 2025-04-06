import type { LoomConfig, LoomContext, LoomInstance } from "./types";
import { type } from "arktype";
import { compare } from "compare-versions";

function _validate<T extends type.Any>(value: T["infer"], schema: T): T["infer"] {
  const out = schema(value);
  if (out instanceof type.errors) {
    throw new TypeError(out.summary);
  }
  return out;
}

export function createLoom<
  TInputSchema extends type.Any,
  TOptionsSchema extends type.Any,
  TPresets extends Record<string, TInputSchema["infer"][]>,
>(
  config: LoomConfig<TInputSchema, TOptionsSchema, TPresets>,
): LoomInstance<TInputSchema, TOptionsSchema, TPresets> {
  const baseLoomFn = (
    options: TOptionsSchema["infer"] & { input: TInputSchema["infer"][] },
  ): string => {
    // validate options against schema
    const validatedOptions = _validate(options, config.optionsSchema);

    const validatedInput = _validate(options.input, config.inputSchema.array());

    // create context for template
    const ctx: LoomContext<TOptionsSchema> = Object.freeze(
      buildLoomContext(validatedOptions),
    );

    // generate output for each item
    const lines: string[] = [];

    for (const item of validatedInput) {
      // if predicate is defined, and returns false, skip this item
      if (config.predicate && !config.predicate(ctx, item)) {
        continue;
      }

      lines.push(config.template(ctx, item));
    }

    const hasLinesWithLength = lines.some((line) => line.trim().length > 0);

    if (config.eof && hasLinesWithLength) {
      lines.push("#EOF\n");
    }

    return lines.join("\n");
  };

  // create the preset methods
  const presets = config.presets
    ? Object.fromEntries(
        Object.entries(config.presets).map(([key, value]) => [
          key,
          (options: TOptionsSchema["infer"]) =>
            baseLoomFn({ ...options, input: value }),
        ]),
      )
    : {};

  return Object.assign(baseLoomFn, presets) as LoomInstance<
    TInputSchema,
    TOptionsSchema,
    TPresets
  >;
}

function buildLoomContext<TOptionsSchema extends type.Any>(
  options: TOptionsSchema["infer"],
): LoomContext<TOptionsSchema> {
  return {
    options,
    isVersionLessThan: (version) => {
      return compare(options.version, version, "<");
    },
    isVersionGreaterThan: (version) => {
      return compare(options.version, version, ">");
    },
    isVersionEqual: (version) => {
      return compare(options.version, version, "=");
    },
    isVersionGreaterThanOrEqual: (version) => {
      return compare(options.version, version, ">=");
    },
    isVersionLessThanOrEqual: (version) => {
      return compare(options.version, version, "<=");
    },
  };
}
