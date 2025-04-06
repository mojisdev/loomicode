import type { z } from "zod";

export type LoomContextHelperFn = (version: string) => boolean;

export interface LoomContextHelpers {
  /**
   * Check if the version of the Unicode standard is lower than the given version.
   */
  isVersionLessThan: LoomContextHelperFn;

  /**
   * Check if the version of the Unicode standard is greater than the given version.
   */
  isVersionGreaterThan: LoomContextHelperFn;

  /**
   * Check if the version of the Unicode standard is equal to the given version.
   */
  isVersionEqual: LoomContextHelperFn;

  /**
   * Check if the version of the Unicode standard is greater than or equal to the given version.
   */
  isVersionGreaterThanOrEqual: LoomContextHelperFn;

  /**
   * Check if the version of the Unicode standard is less than or equal to the given version.
   */
  isVersionLessThanOrEqual: LoomContextHelperFn;
}

export interface LoomContext<TOptionsSchema extends z.ZodType> extends LoomContextHelpers {
  /**
   * The options.
   */
  options: TOptionsSchema["_input"];
}

export interface LoomConfig<
  TInputSchema extends z.ZodType,
  TOptionsSchema extends z.ZodType,
  TPresets extends Record<string, TInputSchema["_input"][]>,
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
   * Should there be an EOF marker at the end of the output?
   */
  eof?: boolean;

  /**
   * The predicate function. If provided, the loom will only process items that return true.
   */
  predicate?: (ctx: LoomContext<TOptionsSchema>, item: TInputSchema["_input"]) => boolean;

  /**
   * Attach custom presets to the loom.
   */
  presets?: TPresets;
}

export type LoomInstance<
  TInputSchema extends z.ZodType,
  TOptionsSchema extends z.ZodType,
  TPresets extends Record<string, TInputSchema["_input"][]>,
> = {
  (options: TOptionsSchema["_input"] & { input: TInputSchema["_input"][] }): string;
} & {
  [key in keyof TPresets]: (options: TOptionsSchema["_input"]) => string;
};
