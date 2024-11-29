import type { Place } from "../../../commerce/types.ts";
import type { AppContext } from "../../mod.ts";
import { toPlace } from "../../utils/transform.ts";

export default async function loader(
  _props: unknown,
  _req: Request,
  ctx: AppContext
): Promise<Place[]> {
  const { my } = ctx;

  const pickupPoints = await my[
    "GET /api/logistics/pvt/configuration/pickuppoints"
  ]({}).then((r) => r.json());

  return pickupPoints.map(toPlace);
}
