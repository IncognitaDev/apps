import { AppContext } from "../mod.ts";

export interface Props {
  code: string;
}

/**
 * @title CaZco Integration
 * @description Coupon Add Action
 */
const loader = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<> => {
  const { api } = ctx;

  const response = await api
    ["POST /api/v1/customer/cart/coupon"]({}, {
      headers: req.headers,
      body: props,
    });

  return response.json();
};

export default loader;
