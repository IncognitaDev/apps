import { Route } from "../../website/flags/audience.ts";
import { AppContext } from "../mod.ts";

const DEFAULT_PROXY_PATHS = [
  "/customer/login",
  "/customer/login/*",
  "/checkout",
  "/checkout/*",
];

export interface Props {
  /** @description ex: /p/fale-conosco */
  pagesToProxy?: string[];
}

/**
 * @title Wap Proxy Routes
 */
function loader(
  { pagesToProxy = [] }: Props,
  _req: Request,
  ctx: AppContext,
): Route[] {
  const { baseUrl = "s623.cazco.link" } = ctx;

  const checkout = [
    ...DEFAULT_PROXY_PATHS,
    ...pagesToProxy,
  ].map((pathTemplate) => ({
    pathTemplate,
    handler: {
      value: {
        __resolveType: "website/handlers/proxy.ts",
        url: baseUrl,
        customHeaders: [{
          Host: baseUrl,
        }],
      },
    },
  }));

  return checkout;
}

export default loader;
