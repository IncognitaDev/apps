import { AppContext } from "../../mod.ts";

export interface Props {
  productId: number;
}

/**
 * @title CaZco Integration
 * @description Add Item To Cart Action
 */
const loader = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<> => {
  const { api } = ctx;
  const { productId, ...body } = props;

  const response = await api
    ["POST /api/v1/customer/cart/add/:productId"]({
      productId,
    }, {
      headers: req.headers,
      body,
    });

  return response.json();
};

export default loader;
