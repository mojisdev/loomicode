export interface WeaveOptions<TInput> {
  amount: number;
  customizer: (input: TInput, index: number) => TInput;
}

const DEFAULT_WEAVE_OPTIONS: WeaveOptions<any> = {
  amount: 10,
  customizer: (input) => input,
};

export function weave<TInput>(input: TInput | TInput[], opts?: WeaveOptions<TInput>): TInput[] {
  const { amount, customizer } = opts ?? DEFAULT_WEAVE_OPTIONS;

  // convert single input to array
  const inputs = Array.isArray(input) ? input : [input];
  const result: TInput[] = [];

  for (let i = 0; i < amount; i++) {
    for (const item of inputs) {
      result.push(customizer(item, i));
    }
  }

  return result;
}
