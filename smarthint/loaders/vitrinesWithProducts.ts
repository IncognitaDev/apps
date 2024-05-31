import { AppContext } from "../mod.ts";
import { toFilters, toProduct, toSortOption } from "../utils/transform.ts";
import { redirect } from "deco/mod.ts";
import { Filter } from "./searchListPage.ts";
import { PageType } from "../utils/typings.ts";
import { Product } from "../../commerce/types.ts";

export interface Props {
  filter?: Filter[];
  categories?: string;
  products?: string[];
  position?: string;
  pageIdentifier?: string;
  pagetype?: PageType;
  channel?: string;
}

export interface SmarthintPosition {
  titleRecommendation?: string;
  eventGoogleAnalytics?: string;
  products?: Product[];
  bannerUrl?: string;
  bannerUrlClick?: string;
  bannerHtml?: string;
  positionBanner?: "First" | "Last";
  hasTimer: boolean;
  startDateTime: string;
  endDateTime: string;
}

/**
 * @title Smarthint Integration
 * @description Product List Page
 */
const loader = async (
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<SmarthintPosition[] | null> => {
  const { recs, shcode } = ctx;
  const {
    categories,
    filter = [],
    pageIdentifier,
    position,
    products: productsParam = [],
    pagetype = 'home',
    channel,
  } = props;


  const filterString = filter.length ? filter.map((filterItem) =>
    `${filterItem.field}:${filterItem.value}`
  ).join("&"): undefined

  const productsString = productsParam.length ? productsParam.map((productId) =>
    `productid:${productId}`
  ).join("&"): undefined

  const data = await recs["GET /recommendationByPage/withProducts"]({
    shcode,
    anonymous: "1", //TODO,
    categories,
    channel,
    filter: filterString,
    pageIdentifier,
    pagetype,
    position,
    products: productsString,
  }).then((r) => r.json());

  const positionItem = data.find((item) =>
    item["smarthint-position"] == position
  );

  if (!positionItem) return null;

  const {
    recommendationsProducts = [],
    recommendationsPromotional = [],
    recommendationsCombination = [],
    recommendations = [],
  } = positionItem;

  const allItems = [
    ...recommendationsProducts,
    ...recommendationsPromotional,
    ...recommendationsCombination,
    ...recommendations,
  ];

  const sortedItem = allItems.toSorted((a, b) => a.order! - b.order!);

  return sortedItem.map((item) => ({
    eventGoogleAnalytics: item.eventGoogleAnalytics,
    titleRecommendation: item.titleRecommendation,
    products: item.products?.map((product) => toProduct(product)) ?? [],
  }));
};

export default loader;
