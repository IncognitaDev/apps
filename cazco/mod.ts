import type { App, AppContext as AC } from "deco/mod.ts";
import manifest, { Manifest } from "./manifest.gen.ts";
import { createHttpClient } from "../utils/http.ts";
import { OpenAPI } from "./utils/openapi/api.openapi.gen.ts";
import { fetchSafe } from "../utils/fetch.ts";

export interface Props {
  // you can freely change this to accept new properties when installing this app
  baseUrl: string;
}

export interface State extends Props {
  api: ReturnType<typeof createHttpClient<OpenAPI>>;
}

/**
 * @title CaZco
 * @description Loaders and actions for adding CaZco Commerce Platform to your website.
 * @category Ecommmerce
 */
export default function App(
  props: Props,
): App<Manifest, State> {
  const api = createHttpClient<OpenAPI>({
    base: "http://loja.cazco.io",
    fetcher: fetchSafe,
  });

  const state = { ...props, api };

  return { manifest, state };
}

export type AppContext = AC<ReturnType<typeof App>>;
