import { HttpError } from "../../utils/http.ts";

const maxRetries = 2;

export const refetcherIfEmpty = async (
  input: string | Request | URL,
  init?: RequestInit,
) => {
  let sleepMs = 250;
  let iterationCount = 0;
  while (true) {
    iterationCount++;
    const response = await fetch(input, init);

    try {
      const resClone = await response.clone();
      const body = await resClone.json();

      if (body?.products?.length > 0 || iterationCount > maxRetries) {
        return response;
      }
    } catch (err) {
      if (iterationCount > maxRetries) {
        throw new HttpError(response.status, `${await response.text()}`);
      }
    }
    console.warn(`Failed fetching. Retrying in ${sleepMs}ms...`);
    await new Promise((resolve) => setTimeout(resolve, sleepMs));
    sleepMs = Math.min(sleepMs * 2, 10_000);
  }
};
