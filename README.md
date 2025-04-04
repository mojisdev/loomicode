# @mojis/loomicode

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

A loom for unicode data files

> [!WARNING]
> This package is still under development and the API is subject to change.
> Some of the missing features are:
> - Support for generating multiple entries from a single input
> - Handle Version Alignment
> - Predicates for filtering versions

## 📦 Installation

```bash
npm install @mojis/loomicode
```

## Usage

```ts
import { sequences } from "@mojis/loomicode";

const result = sequences({
  separator: ";",
  commentPrefix: "#",
  version: "1.0",
  input: [
    {
      codePoints: ["1F600", "1F601"],
      type: "emoji",
      description: "smiling face",
      comment: "happy expression"
    }
  ],
});

console.log(result);
```

## 📄 License

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@mojis/loomicode?style=flat&colorA=18181B&colorB=4169E1
[npm-version-href]: https://npmjs.com/package/@mojis/loomicode
[npm-downloads-src]: https://img.shields.io/npm/dm/@mojis/loomicode?style=flat&colorA=18181B&colorB=4169E1
[npm-downloads-href]: https://npmjs.com/package/@mojis/loomicode
