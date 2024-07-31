import { ProductListingPage } from "../../commerce/types.ts";
import { AppContext } from "../mod.ts";
import {
  // getFilterParam,
  // getPaginationInfo,
  // getSortParam,
  // resolvePage,
  // toFilters,
  toProduct,
  // toSortOption,
} from "../utils/transform.ts";
import { redirect } from "deco/mod.ts";

export interface Props {
  categoryId: number;
  productId: number;
  sku: string;
  sort: string;
  order: string;
  page: number;
  limit: number;
}

/**
 * @title CaZco Integration - Product List Page
 * @description Product List Page
 */
const loader = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<ProductListingPage | null> => {
  const { api } = ctx;
  const { categoryId, limit, order, page, productId, sku, sort } = props;

  const response = await api["GET /api/v1/products"]({
    categoryId,
    limit,
    order,
    page,
    productId,
    sku,
    sort,
  }).then((r) => r.json());

  if (!response) return null;

  const products =
    response?.Products?.map((product) => toProduct(product as SHProduct)) ?? [];

  // const sortOptions = toSortOption(response?.Sorts ?? []);

  // const resultFilters = toFilters(response?.Filters ?? [], url);

  // const { nextPage, previousPage } = getPaginationInfo(
  //   url,
  //   size,
  //   from,
  //   page,
  //   response?.TotalResult,
  // );

  return {
    "@type": "ProductListingPage",
    products: products,
    // sortOptions,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [],
      numberOfItems: 0,
    },
    // filters: resultFilters,
    pageInfo: {
      records: response.meta.total,
      recordPerPage: response.meta.per_page,
      // nextPage: nextPage,
      // previousPage: previousPage,
      currentPage: response.meta.current_page,
      pageTypes: [
        "Search",
      ],
    },
  };
};

export default loader;
