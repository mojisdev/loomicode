import type { type } from "arktype";

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

export interface LoomContext<TOptionsSchema extends type.Any> extends LoomContextHelpers {
  /**
   * The options.
   */
  options: TOptionsSchema["infer"];
}

export interface LoomConfig<
  TInputSchema extends type.Any,
  TOptionsSchema extends type.Any,
  TPresets extends Record<string, TInputSchema["infer"][]>,
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
    item: TInputSchema["infer"]
  ) => string;

  /**
   * Should there be an EOF marker at the end of the output?
   */
  eof?: boolean;

  /**
   * The predicate function. If provided, the loom will only process items that return true.
   */
  predicate?: (ctx: LoomContext<TOptionsSchema>, item: TInputSchema["infer"]) => boolean;

  /**
   * Attach custom presets to the loom.
   */
  presets?: TPresets;
}

export type LoomInstance<
  TInputSchema extends type.Any,
  TOptionsSchema extends type.Any,
  TPresets extends Record<string, TInputSchema["infer"][]>,
> = {
  (options: TOptionsSchema["infer"] & { input: TInputSchema["infer"][] }): string;
} & {
  [key in keyof TPresets]: (options: TOptionsSchema["infer"]) => string;
};
