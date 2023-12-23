// DO NOT EDIT. This file is generated by deco.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $$$0 from "./loaders/proxy.ts";
import * as $$$1 from "./loaders/cart.ts";
import * as $$$2 from "./loaders/suggestion.ts";
import * as $$$3 from "./loaders/productList.ts";
import * as $$$4 from "./loaders/user.ts";
import * as $$$5 from "./loaders/shop.ts";
import * as $$$6 from "./loaders/recommendations.ts";
import * as $$$7 from "./loaders/productDetailsPage.ts";
import * as $$$8 from "./loaders/wishlist.ts";
import * as $$$9 from "./loaders/productListingPage.ts";
import * as $$$$0 from "./handlers/sitemap.ts";
import * as $$$$$$$$$0 from "./actions/submmitForm.ts";
import * as $$$$$$$$$1 from "./actions/notifyme.ts";
import * as $$$$$$$$$2 from "./actions/shippingSimulation.ts";
import * as $$$$$$$$$3 from "./actions/review/create.ts";
import * as $$$$$$$$$4 from "./actions/newsletter/register.ts";
import * as $$$$$$$$$5 from "./actions/wishlist/removeProduct.ts";
import * as $$$$$$$$$6 from "./actions/wishlist/addProduct.ts";
import * as $$$$$$$$$7 from "./actions/cart/removeCoupon.ts";
import * as $$$$$$$$$8 from "./actions/cart/updateItemQuantity.ts";
import * as $$$$$$$$$9 from "./actions/cart/addCoupon.ts";
import * as $$$$$$$$$10 from "./actions/cart/addItems.ts";
import * as $$$$$$$$$11 from "./actions/cart/addItem.ts";

const manifest = {
  "loaders": {
    "wake/loaders/cart.ts": $$$1,
    "wake/loaders/productDetailsPage.ts": $$$7,
    "wake/loaders/productList.ts": $$$3,
    "wake/loaders/productListingPage.ts": $$$9,
    "wake/loaders/proxy.ts": $$$0,
    "wake/loaders/recommendations.ts": $$$6,
    "wake/loaders/shop.ts": $$$5,
    "wake/loaders/suggestion.ts": $$$2,
    "wake/loaders/user.ts": $$$4,
    "wake/loaders/wishlist.ts": $$$8,
  },
  "handlers": {
    "wake/handlers/sitemap.ts": $$$$0,
  },
  "actions": {
    "wake/actions/cart/addCoupon.ts": $$$$$$$$$9,
    "wake/actions/cart/addItem.ts": $$$$$$$$$11,
    "wake/actions/cart/addItems.ts": $$$$$$$$$10,
    "wake/actions/cart/removeCoupon.ts": $$$$$$$$$7,
    "wake/actions/cart/updateItemQuantity.ts": $$$$$$$$$8,
    "wake/actions/newsletter/register.ts": $$$$$$$$$4,
    "wake/actions/notifyme.ts": $$$$$$$$$1,
    "wake/actions/review/create.ts": $$$$$$$$$3,
    "wake/actions/shippingSimulation.ts": $$$$$$$$$2,
    "wake/actions/submmitForm.ts": $$$$$$$$$0,
    "wake/actions/wishlist/addProduct.ts": $$$$$$$$$6,
    "wake/actions/wishlist/removeProduct.ts": $$$$$$$$$5,
  },
  "name": "wake",
  "baseUrl": import.meta.url,
};

export type Manifest = typeof manifest;

export default manifest;
