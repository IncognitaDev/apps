// DO NOT EDIT. This file is generated by deco.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $$$0 from "./loaders/extensions/products.ts";
import * as $$$1 from "./loaders/extensions/productDetails.ts";
import * as $$$$$$0 from "./sections/Seo/SeoPLP.tsx";
import * as $$$$$$1 from "./sections/Seo/SeoPDP.tsx";

const manifest = {
  "loaders": {
    "commerce/loaders/extensions/productDetails.ts": $$$1,
    "commerce/loaders/extensions/products.ts": $$$0,
  },
  "sections": {
    "commerce/sections/Seo/SeoPDP.tsx": $$$$$$1,
    "commerce/sections/Seo/SeoPLP.tsx": $$$$$$0,
  },
  "name": "commerce",
  "baseUrl": import.meta.url,
};

export type Manifest = typeof manifest;

export default manifest;
