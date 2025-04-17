import { HttpError } from "std/http/mod.ts";
import { AppContext } from "../../mod.ts";

export interface Props {
  holderName: string;
  cardNumber: string;
  validationCode: string;
  dueDate: string;
  document: string;
}

export default async function loader(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  const { my, vp } = ctx;

  console.log("pre orderForm");
  const orderForm = await ctx.invoke.vtex.loaders.cart();
  console.log("pos orderForm");

  // const placeOrderResponse = await my["PUT /api/checkout/pub/orders"](
  //   {},
  //   { body: orderForm },
  // );

  const placeOrderResponse = await my[
    "POST /api/checkout/pub/orderForm/:orderFormId/transaction"
  ](
    { orderFormId: orderForm.orderFormId },
    {
      body: {
        referenceId: orderForm.orderFormId,
        savePersonalData: false,
        optinNewsLetter: false,
        value: orderForm.value,
        referenceValue: orderForm.value,
        interestValue: 0,
      },
    },
  );

  // const placeOrderResponse = await my[
  //   "POST /api/checkout/pub/orderform/:orderFormId/transaction"
  // ](
  //   { orderFormId: orderForm.orderFormId },
  //   {
  //     body: {
  //       referenceId: orderForm.orderFormId,
  //       value: orderForm.value,
  //       referenceValue: orderForm.value,
  //       savePersonalData: true,
  //       optinNewsLetter: orderForm.optinNewsLetter,
  //     },
  //   }
  // );

  const placeOrder = await placeOrderResponse.json();
  const placeOrderHeaders = placeOrderResponse.headers;

  console.log("pos placeOrder", placeOrder);

  const cookies = placeOrderHeaders.get("set-cookie");
  console.log("pos placeOrder", placeOrder, cookies);

  const cardInfos = [
    {
      paymentSystem: placeOrder.merchantTransactions?.[0]?.payments[0]
        .paymentSystem,
      installments: 1,
      currencyCode: "BRL",
      value: placeOrder.merchantTransactions?.[0]?.payments?.[0].value,
      installmentsInterestRate: 0,
      installmentsValue: 0,
      referenceValue: placeOrder.merchantTransactions?.[0]?.payments?.[0]
        .referenceValue,
      fields: {
        ...props,
        addressId: placeOrder.orders?.[0]?.shippingData?.address?.addressId,
      },
      transaction: {
        id: placeOrder.merchantTransactions?.[0]?.transactionId,
        merchantName: placeOrder.merchantTransactions?.[0]?.merchantName,
      },
    },
  ];

  // console.log("cardInfos", placeOrder.transactionData);

  const res = await vp["POST /api/pub/transactions/:transactionId/payments"](
    {
      transactionId: placeOrder?.merchantTransactions?.[0]?.transactionId,
      orderId: placeOrder.orderGroup,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies,
      },
      body: JSON.stringify(cardInfos),
    },
  ).then((res) => {
    console.log("Then", res.status);
    return res;
  }).catch((err) => {
    console.log("Catch", err);
    return err;
  });

  console.log("res", res.json());

  console.log("pos sendPaymentResponse");

  const finalResponse = await my
    ["POST /api/checkout/pub/gatewayCallback/:orderGroup"](
      { orderGroup: placeOrder.orderGroup },
      { headers: { Cookie: cookies } },
    ).then((res) => {
      console.log("Then orderGroup", res.status);
      return res;
    }).catch((err: HttpError) => {
      console.log("Catch orderGroup", err.message);
      try {
        const json = JSON.parse(err.message);
        if (json.RedirectResponseCollection) {
          return json;
        }
      } catch (e) {
      }

      return err;
    });

  if (finalResponse?.RedirectResponseCollection) {
    return finalResponse;
  }

  console.log("pos finalResponse");

  return;
}
