import { type MatchContext } from "@deco/deco/blocks";
/**
 * @title {{{includes}}} {{{match}}}
 */
export interface Props {
  includes?: string;
  match?: string;
}
/**
 * @title User Agent
 * @description Target users based on their web browser or operational system
 * @icon world
 */
const MatchUserAgent = (
  { includes, match }: Props,
  { request }: MatchContext,
) => {
  const ua = request.headers.get("user-agent") || "";
  const regexMatch = match ? new RegExp(match).test(ua) : true;
  const includesFound = includes ? ua.includes(includes) : true;
  return regexMatch && includesFound;
};
export default MatchUserAgent;
