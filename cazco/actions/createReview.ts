import { AppContext } from "../mod.ts";

export interface Props {
  productId: number;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  title: string;
  // TODO FILE
  attachments?: string[];
}

/**
 * @title CaZco Integration
 * @description Create Product Review Action
 */
const loader = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<> => {
  const { api } = ctx;
  const { productId, ...body } = props;

  const response = await api
    ["POST /api/v1/products/:productId/reviews"]({
      productId,
    }, {
      headers: req.headers,
      body,
    });

  return response.json();
};

export default loader;
