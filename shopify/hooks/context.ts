import { IS_BROWSER } from "$fresh/runtime.ts";
import { signal } from "@preact/signals";
import { Person } from "../../commerce/types.ts";
import { invoke } from "../runtime.ts";
import type { CartFragment } from "../utils/storefront/storefront.graphql.gen.ts";

export interface Context {
  user: Person | null;
  cart: CartFragment | null;
}

const loading = signal<boolean>(true);
const context = {
  user: IS_BROWSER && signal<Person | null>(null) || { value: null },
  cart: IS_BROWSER && signal<CartFragment | null>(null) || { value: null },
};

let queue = Promise.resolve();
let abort = () => {};

const enqueue = (
  cb: (signal: AbortSignal) => Promise<Partial<Context>> | Partial<Context>,
) => {
  abort();

  loading.value = true;
  const controller = new AbortController();

  queue = queue.then(async () => {
    try {
      const { user, cart } = await cb(controller.signal);

      controller.signal.throwIfAborted();

      context.cart.value = cart || context.cart.value;
      context.user.value = user || context.user.value;

      loading.value = false;
    } catch (error) {
      if (error.name === "AbortError") return;

      console.error(error);
      loading.value = false;
    }
  });

  abort = () => controller.abort();

  return queue;
};

const load = (signal: AbortSignal) =>
  invoke({
    cart: invoke.shopify.loaders.cart(),
    user: invoke.shopify.loaders.user(),
  }, { signal });

if (IS_BROWSER) {
  enqueue(load);

  document.addEventListener(
    "visibilitychange",
    () => document.visibilityState === "visible" && enqueue(load),
  );
}

export const state = {
  ...context,
  loading,
  enqueue,
};
