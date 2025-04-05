export interface WeaveOptions<TInput> {
  /**
   * The amount of items to generate
   * @default 10
   */
  amount: number;

  /**
   * A function that will be called for each item to be generated
   */
  customizer?: WeaveCustomizer<TInput>;

  /**
   * A list of fields that will be used to generate random values
   */
  fields?: WeaveFields<TInput>;
}

const DEFAULT_WEAVE_OPTIONS: WeaveOptions<any> = {
  amount: 10,
  customizer: (input) => input,
  fields: {},
};

export type WeaveCustomizer<TInput> = (input: TInput, index: number) => TInput;
export type WeaveFields<TInput> = {
  [K in keyof Partial<TInput>]?: Array<TInput[K]>;
};

/**
 * Weaves new objects into an array based on a template from the input.
 *
 * @template TInput The type of the input object(s).
 * @param {TInput | TInput[]} input An object or array of objects to use as templates.
 * @param {WeaveOptions<TInput>} [opts] Optional configuration for the weaving process.
 * @param {number} [opts.amount] The number of new objects to weave into the array. Must be a positive number.
 * @param {WeaveFields<TInput>} [opts.fields] An object specifying fields to randomize in the new objects. Each field should be an array of possible values.
 * @param {WeaveCustomizer<TInput>} [opts.customizer] A function to customize each new object after field randomization.
 * @returns {TInput[]} A new array containing the original input elements plus the woven objects.
 * @throws {Error} If the input is not a valid object or array of objects, or if the amount is not a positive number.
 */
export function weave<TInput extends object>(
  input: TInput | TInput[],
  opts?: WeaveOptions<TInput>,
): TInput[] {
  const { amount, customizer, fields } = opts ?? DEFAULT_WEAVE_OPTIONS;

  // Convert single object input to array
  const inputArray = Array.isArray(input) ? input : [input];

  if (inputArray.length === 0) {
    throw new Error("input must be a non-empty array of objects or a valid object");
  }

  if (typeof amount !== "number" || amount <= 0) {
    throw new Error("amount must be a positive number");
  }

  const result: TInput[] = [...inputArray];

  for (let i = 0; i < amount; i++) {
    const templateIndex = Math.floor(Math.random() * inputArray.length);
    let template = { ...inputArray[templateIndex] } as TInput;

    // apply random values from fields if provided
    if (fields != null && typeof fields === "object") {
      Object.entries(fields).forEach(([field, values]) => {
        if (field in template && Array.isArray(values) && values.length > 0) {
          const randomValueIndex = Math.floor(Math.random() * values.length);
          (template as any)[field] = values[randomValueIndex];
        }
      });
    }

    // apply customizer if provided
    if (customizer != null && typeof customizer === "function") {
      template = customizer(template, i);
    }

    result.push(template);
  }

  return result;
}
