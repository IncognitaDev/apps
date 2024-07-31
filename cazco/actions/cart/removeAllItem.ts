import { AppContext } from "../../mod.ts";

/**
 * @title CaZco Integration
 * @description Remove all products from cart Action
 */
const loader = async (
  _props: unknown,
  req: Request,
  ctx: AppContext,
): Promise<> => {
  const { api } = ctx;

  const response = await api
    ["DELETE /api/v1/customer/cart/empty"]({}, {
      headers: req.headers,
    });

  return response.json();
};

export default loader;
