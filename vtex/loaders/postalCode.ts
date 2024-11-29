import { AppContext } from "../mod.ts";
import { proxySetCookie } from "../utils/cookies.ts";
import { parseCookie } from "../utils/orderForm.ts";

export interface Props {
  postalCode: string;
  countryCode?: string;
}

/**
 * @docs https://developers.vtex.com/docs/api-reference/checkout-api#get-/api/checkout/pub/postal-code/:countryCode/:postalCode
 */
const loader = async (props: Props, req: Request, ctx: AppContext) => {
  const { vcs } = ctx;
  const { cookie } = parseCookie(req.headers);

  const response = await vcs[
    "GET /api/checkout/pub/postal-code/:countryCode/:postalCode"
  ](
    { postalCode: props.postalCode, countryCode: props.countryCode ?? "BRA" },
    { headers: { cookie } }
  );

  const result = await response.json();

  proxySetCookie(response.headers, ctx.response.headers, req.url);

  return result;
};

export default loader;
