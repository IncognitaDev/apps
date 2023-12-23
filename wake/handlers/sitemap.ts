import { ConnInfo } from "std/http/server.ts";
import { AppContext } from "../mod.ts";
import { invoke } from "../runtime.ts";

export interface Props {
  include?: string[];
}
/**
 * @title Sitemap Proxy
 */
export default function Sitemap(
  { include }: Props,
  { }: AppContext,
) {
  return async (
    req: Request,
    ctx: ConnInfo,
  ) => {
    console.log('aqui')
    // if (!url) {
    //   throw new Error("Missing publicUrl");
    // }

    // const urlFromPublicUrl =
    //   new URL(url?.startsWith("http") ? url : `https://${url}`).href;

    /**
     * Some stores were having problems with the IO sitemap (missing categories and brands)
     */
    // const publicUrl = usePortalSitemap
    //   ? `https://${account}.vtexcommercestable.com.br/`
    //   : urlFromPublicUrl;

    const sitemapURL = await invoke.wake.loaders.shop()

    console.log(sitemapURL)

    // const response = await Proxy({
    //   url: publicUrl,
    // })(req, ctx);

    // const reqUrl = new URL(req.url);
    // const text = await response.text();

    return new Response(
      // includeSiteMaps(
      //   text.replaceAll(publicUrl, `${reqUrl.origin}/`),
      //   reqUrl.origin,
      //   include,
      // ),
      sitemapURL,
      {
        // headers: response.headers,
        status: 202 //response.status,
      },
    );
  };
}
