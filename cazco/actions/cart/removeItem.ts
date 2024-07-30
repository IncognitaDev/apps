import { AppContext } from "../mod.ts";

export interface Props {
  cartItemId: number;
}

/**
 * @title CaZco Integration
 * @description Remove Product From Cart Action
 */
const loader = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<> => {
  const { api } = ctx;
  const { cartItemId, ...body } = props;

  const response = await api
    ["DELETE /api/v1/customer/cart/remove/:cartItemId"]({
      cartItemId,
    }, {
      headers: req.headers,
      body,
    });

  return response.json();
};

export default loader;
