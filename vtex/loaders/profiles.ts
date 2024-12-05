import { AppContext } from "../mod.ts";
import { proxySetCookie } from "../utils/cookies.ts";
import { parseCookie } from "../utils/orderForm.ts";
import { getSegmentFromBag } from "../utils/segment.ts";

export interface Props {
  email: string;
}

/**
 * @docs https://developers.vtex.com/docs/api-reference/checkout-api#get-/api/checkout/pub/profiles
 */
const loader = async (props: Props, req: Request, ctx: AppContext) => {
  const { my } = ctx;
  const { cookie } = parseCookie(req.headers);
  const segment = getSegmentFromBag(ctx);

  const response = await my["GET /api/checkout/pub/profiles"](
    { sc: segment?.payload?.channel, email: props.email },
    { headers: { cookie } },
  );

  const result = await response.json();

  proxySetCookie(response.headers, ctx.response.headers, req.url);

  return result;
};

export default loader;
