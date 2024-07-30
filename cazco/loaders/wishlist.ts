import { AppContext } from "../mod.ts";

/**
 * @title CaZco Integration
 * @description Product Wishlist loader
 */
const loader = async (
  _props: unknown,
  req: Request,
  ctx: AppContext,
): Promise<number[] | null> => {
  const { api } = ctx;

  const data = await api
    ["GET /api/v1/customer/wishlist"]({}, {
      headers: req.headers,
    }).then((response) => response.json());

  return data;
};

export default loader;
