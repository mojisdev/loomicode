export interface WeaveOptions<TInput> {
  /**
   * The amount of items to generate
   * @default 10
   */
  amount: number;

  /**
   * A function that will be called for each item to be generated
   * @param {TInput} input - The input object
   * @param {number} index - The index of the item to be generated
   * @returns {TInput} The generated item
   */
  customizer: (input: TInput, index: number) => TInput;

  /**
   * A list of fields that will be used to generate random values
   * @type {{ [K in keyof Partial<TInput>]: Array<TInput[K]> }}
   */
  fields?: {
    [K in keyof Partial<TInput>]: Array<TInput[K]>;
  };
}

const DEFAULT_WEAVE_OPTIONS: WeaveOptions<any> = {
  amount: 10,
  customizer: (input) => input,
  fields: {},
};

export type EnsureValidWeaveInput<TInput> =
  TInput extends any[]
    ? TInput extends (infer TArrayInput)[]
      ? TArrayInput extends Record<string, unknown>
        ? TArrayInput[]
        : never
      : never
    : TInput extends Record<string, unknown>
      ? TInput
      : never;

type RemoveArrayType<TInput> = TInput extends Array<infer TArrayInput> ? TArrayInput : TInput;

/**
 * Weaves new objects into an array based on a template from the input array.
 *
 * @template TInput The type of the input array elements.
 * @param {EnsureValidWeaveInput<TInput>} input An array of objects to use as templates.
 * @param {WeaveOptions<RemoveArrayType<TInput>>} [opts] Optional configuration for the weaving process.
 * @param {number} [opts.amount] The number of new objects to weave into the array. Must be a positive number.
 * @param {WeaveFields<RemoveArrayType<TInput>>} [opts.fields] An object specifying fields to randomize in the new objects. Each field should be an array of possible values.
 * @param {WeaveCustomizer<RemoveArrayType<TInput>>} [opts.customizer] A function to customize each new object after field randomization.
 * @returns {RemoveArrayType<TInput>[]} A new array containing the original input array elements plus the woven objects.
 * @throws {Error} If the input is not a non-empty array, or if the amount is not a positive number.
 */
export function weave<TInput>(input: EnsureValidWeaveInput<TInput>, opts?: WeaveOptions<RemoveArrayType<TInput>>): RemoveArrayType<TInput>[] {
  const { amount, customizer, fields } = opts ?? DEFAULT_WEAVE_OPTIONS;

  if (!Array.isArray(input) || input.length === 0) {
    throw new Error("Input must be a non-empty array of objects");
  }

  if (typeof amount !== "number" || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }

  const result: RemoveArrayType<TInput>[] = [
    ...input,
  ];

  for (let i = 0; i < amount; i++) {
    const templateIndex = Math.floor(Math.random() * input.length) ?? 0;
    let template = { ...input[templateIndex] };

    // apply random values from fields if provided
    if (fields && typeof fields === "object") {
      (Object.keys(fields) as Array<keyof RemoveArrayType<TInput>>).forEach((field) => {
        if (field in template && Array.isArray(fields[field]) && fields[field]!.length > 0) {
          const randomValueIndex = Math.floor(Math.random() * fields[field]!.length);
          template[field] = fields[field]![randomValueIndex];
        }
      });
    }

    // apply customizer if provided
    if (customizer && typeof customizer === "function") {
      template = customizer(template, i);
    }

    result.push(template);
  }

  return result;
}
