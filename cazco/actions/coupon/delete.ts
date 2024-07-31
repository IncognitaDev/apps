import { AppContext } from "../../mod.ts";

/**
 * @title CaZco Integration
 * @description Coupon Remove Action
 */
const loader = async (
  props: unknown,
  req: Request,
  ctx: AppContext,
): Promise<> => {
  const { api } = ctx;

  const response = await api
    ["DELETE /api/v1/customer/cart/coupon"]({}, {
      headers: req.headers,
      body: props,
    });

  return response.json();
};

export default loader;
