import { SelectItemEvent } from "../../../commerce/types.ts";
import { scriptAsDataURI } from "../../../utils/dataURI.ts";
import { AppContext } from "../../mod.ts";
import { Props as ClickProps } from "../../actions/click.ts";
import { PageType } from "../../utils/typings.ts";

declare global {
  interface Window {
    smarthint: {
      click: (props: ClickProps) => void;
    };
  }
}

const listner = ({ shcode, url, pageType }: ReturnType<typeof loader>) => {
  console.log({ url });
  const click = (
    {
      productId,
      position,
      clickFeature,
      term,
      positionRecommendation,
      productPrice,
      shippingPrice,
      shippingTime,
      clickProduct,
    }: ClickProps,
  ) => {
    const clickUrl = new URL("https://recs.smarthint.co/track/click");
    const date = new Date().toLocaleString().replace(",", "");
    const origin = new URL(url).origin;

    const session = getCookie("SH_SESSION") ?? "";

    clickUrl.searchParams.set("clickFeature", clickFeature);
    clickUrl.searchParams.set("shcode", shcode);
    clickUrl.searchParams.set("clickProduct", clickProduct);
    clickUrl.searchParams.set("productId", productId);
    clickUrl.searchParams.set("locationRecs", positionRecommendation);
    clickUrl.searchParams.set("position", String(position));
    clickUrl.searchParams.set("origin", origin);
    clickUrl.searchParams.set("date", date);
    clickUrl.searchParams.set("pagetype", pageType);
    clickUrl.searchParams.set("productPrice", String(productPrice));
    clickUrl.searchParams.set("anonymousConsumer", "1");
    clickUrl.searchParams.set("session", session);

    if (term) clickUrl.searchParams.set("term", term);
    if (shippingPrice) {
      clickUrl.searchParams.set("shippingPrice", String(shippingPrice));
    }
    if (shippingTime) {
      clickUrl.searchParams.set("shippingTime", String(shippingTime));
    }
    if (shippingTime) {
      clickUrl.searchParams.set("shippingTime", String(shippingTime));
    }

    console.log("smarthint", clickUrl);

    fetch(clickUrl);
  };

  const setup = () => {
    console.log("smarthint");

    globalThis.window.smarthint = { click };

    globalThis.window.DECO.events.subscribe((event) => {
      // console.log(event?.name)

      // if(isSelectItemEvent(event)){
      //   click({
      //     productId: event.params.items[0].item_group_id,
      //     position: event.params.items[0].index
      //   })
      // }
    });
  };

  function getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function setCookie(name: string, value: string, seconds: number): void {
    let expires = "";
    if (seconds) {
      const date = new Date();
      date.setTime(date.getTime() + seconds);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/`;
  }

  function resetCookieExpiration(
    name: string,
    value: string,
    seconds: number,
  ): void {
    const date = new Date();
    const dateExpiration = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59,
      999,
    );
    const dateLimit = dateExpiration.getTime() - date.getTime();

    const cookieLimit = dateLimit < seconds ? dateLimit : seconds;

    setCookie(name, value, cookieLimit);
  }

  function setupCookieResetOnInteraction(
    cookieName: string,
    cookieValue: string,
    expirationSeconds: number,
  ): void {
    const resetCookie = () => {
      resetCookieExpiration(cookieName, cookieValue, expirationSeconds);
    };

    document.addEventListener("click", resetCookie);
    document.addEventListener("keydown", resetCookie);
    document.addEventListener("mousemove", resetCookie);
    document.addEventListener("scroll", resetCookie);
    document.addEventListener("touchstart", resetCookie);
  }

  function createUserToken() {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }

    return (Math.random() * 1e9).toFixed();
  }

  function setupSession() {
    const sessionValue = getCookie("SH_SESSION") ?? createUserToken();

    setupCookieResetOnInteraction("SH_SESSION", sessionValue, 30 * 60 * 1000);
  }

  const pageView = () => {
    globalThis.window.addEventListener("load", () => {
      console.log("pageview call");
      const pageUrl = new URL(url);
      const origin = pageUrl.origin;
      const date = new Date().toLocaleString().replace(",", "");

      const pageViewUrl = new URL("https://recs.smarthint.co/track/pageView");

      const session = getCookie("SH_SESSION") ?? "";

      pageViewUrl.searchParams.set("shcode", shcode);
      pageViewUrl.searchParams.set("url", pageUrl.href);
      pageViewUrl.searchParams.set("origin", origin);
      pageViewUrl.searchParams.set("pageType", pageType);
      pageViewUrl.searchParams.set("elapsedTime", "0");
      pageViewUrl.searchParams.set("date", date);
      pageViewUrl.searchParams.set("session", session);
      pageViewUrl.searchParams.set("anonymousConsumer", "1");

      fetch(pageViewUrl);
    });
  };

  setup();
  setupSession();
  pageView();
};

function Analytics(props: ReturnType<typeof loader>) {
  return (
    <script
      defer
      src={scriptAsDataURI(
        listner,
        props,
      )}
    />
  );
}

export interface Props {
  pageType: PageType;
}

export const loader = (props: Props, req: Request, ctx: AppContext) => {
  const { shcode } = ctx;

  const tempurl = new URL(
    "https://deco-sites-prohall--smarthint.deno.dev/smarthint/home",
  );
  tempurl.host = "www.lojaprohall.com.br";
  tempurl.port = "";

  console.log(tempurl);

  return {
    shcode,
    url: tempurl.href,
    pageType: props.pageType,
  };
};

export default Analytics;
