import { Suggestion } from "../../commerce/types.ts";
import { AppContext } from "../mod.ts";
import { toProduct } from "../utils/transform.ts";

export interface Props {
  query: string;
  /**
   * @description limit of products to show
   */
  sizeProducts?: number;
  /**
   * @description limit of terms to show
   */
  sizeTerms?: number;
}

/**
 * @title Smarthint Integration
 * @description Autocomplete Loader
 */
const action = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<Suggestion | null> => {
  const { api, shcode, cluster } = ctx;
  const { query, sizeProducts, sizeTerms } = props;

  if (!query) return null;

  const data = await api["GET /v:cluster/Search/GetSuggestionTerms"]({
    cluster,
    shcode,
    sizeProducts: String(sizeProducts),
    sizeTerms: String(sizeTerms),
    term: query,
    anonymous: "1",
  }).then((r) => r.json());

  const products = data.Products?.map((product) => toProduct(product));

  return {
    products: products,
    searches: data.Terms?.map((termItem) => ({
      term: termItem.TermSuggestion!,
      href: termItem.UrlSearch!,
      hits: termItem.Order,
    })),
  };
};

export default action;
