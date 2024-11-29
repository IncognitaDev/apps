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
  ctx: AppContext
) {
  const { my, vp } = ctx;

  console.log("pre orderForm");
  const orderForm = await ctx.invoke.vtex.loaders.cart();
  console.log("pos orderForm");

  const placeOrderResponse = await my["PUT /api/checkout/pub/orders"](
    {},
    { body: orderForm }
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
      paymentSystem: 2,
      installments: 1,
      currencyCode: "BRL",
      value:
        placeOrder.transactionData?.merchantTransactions?.[0]?.payments?.[0]
          .value,
      installmentsInterestRate: 0,
      installmentsValue: 0,
      referenceValue:
        placeOrder.transactionData?.merchantTransactions?.[0]?.payments?.[0]
          .referenceValue,
      fields: {
        ...props,
        addressId: placeOrder.orders?.[0]?.shippingData?.address?.addressId,
      },
      transaction: {
        id: placeOrder.transactionData?.merchantTransactions?.[0]
          ?.transactionId,
        merchantName:
          placeOrder.transactionData?.merchantTransactions?.[0]?.merchantName,
      },
    },
  ];

  console.log("cardInfos", placeOrder.transactionData);

  await vp["POST /api/pub/transactions/:transactionId/payments"](
    {
      transactionId:
        placeOrder.transactionData?.merchantTransactions?.[0]?.transactionId,
      orderId: placeOrder.orders?.[0]?.orderGroup,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies,
      },
      body: JSON.stringify(cardInfos),
    }
  );

  console.log("pos sendPaymentResponse");

  await my["POST /api/checkout/pub/gatewayCallback/:orderGroup"](
    { orderGroup: placeOrder.orders?.[0]?.orderGroup },
    { headers: { Cookie: cookies } }
  );

  console.log("pos finalResponse");

  return;
}
