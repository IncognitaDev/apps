import { Product, UnitPriceSpecification } from "../../commerce/types.ts";

export const toProduct = (product: any): Product => {
  // TODO
  const images = product.images?.map((image) => ({
    "@type": "ImageObject" as const,
    encodingFormat: "image",
    url: image?.url ?? "",
    alternateName: image?.fileName ?? "",
  }));

  const additionalProperty: PropertyValue[] = [];

  if ((product as SingleProductFragment)?.attributeSelections) {
    (product as SingleProductFragment)?.attributeSelections?.selections
      ?.forEach((selection) => {
        if (selection?.name == "Outras Opções") {
          selection.values?.forEach((value) => {
            additionalProperty.push({
              "@type": "PropertyValue",
              url: value?.alias ?? undefined,
              value: value?.selected ? "true" : "false",
              name: value?.value ?? undefined,
              valueReference: "SELECTIONS",
            });
          });
        }
      });
  }

  product.informations?.forEach((info) =>
    additionalProperty.push({
      "@type": "PropertyValue",
      name: info?.type ?? undefined,
      alternateName: info?.title ?? undefined,
      value: info?.value ?? undefined,
      valueReference: "INFORMATION",
    })
  );
  product.attributes?.forEach((attr) =>
    additionalProperty.push({
      "@type": "PropertyValue",
      name: attr?.name ?? undefined,
      value: attr?.value ?? undefined,
      valueReference: "SPECIFICATION",
    })
  );

  if (product.urlVideo) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "urlVideo",
      value: product.urlVideo,
      valueReference: "PROPERTY",
    });
  }

  if (product.promotions) {
    product.promotions.map((promotion) => {
      additionalProperty.push({
        "@type": "PropertyValue",
        name: promotion!.title ?? undefined,
        value: promotion!.content ?? undefined,
        identifier: promotion!.id,
        image: promotion!.fullStampUrl
          ? [{
            "@type": "ImageObject",
            encodingFormat: "image",
            url: promotion!.fullStampUrl,
          }]
          : undefined,
        valueReference: "PROMOTION",
      });
    });
  }

  if (product.collection) {
    additionalProperty.push({
      "@type": "PropertyValue",
      name: "collection",
      value: product.collection ?? undefined,
      valueReference: "COLLECTION",
    });
  }

  const priceSpecification: UnitPriceSpecification[] = [];

  if (product.prices?.listPrice) {
    priceSpecification.push({
      "@type": "UnitPriceSpecification",
      priceType: "https://schema.org/ListPrice",
      price: product.prices.listPrice,
    });
  }
  if (product.prices?.price) {
    priceSpecification.push({
      "@type": "UnitPriceSpecification",
      priceType: "https://schema.org/SalePrice",
      price: product.prices.price,
    });
  }

  if (product.prices?.installmentPlans) {
    product.prices.installmentPlans.forEach((installmentPlan) => {
      if (installmentPlan) {
        installmentPlan.installments?.forEach((installment) => {
          priceSpecification.push({
            "@type": "UnitPriceSpecification",
            priceType: "https://schema.org/SalePrice",
            priceComponentType: "https://schema.org/Installment",
            name: installmentPlan.displayName ?? undefined,
            description: installmentPlan.name ?? undefined,
            billingDuration: installment?.number,
            billingIncrement: installment?.value,
            price: installment?.value,
          });
        });
      }
    });
  }
  const review = product.reviews?.map((review) => ({
    "@type": "Review" as const,
    author: [
      {
        "@type": "Author" as const,
        name: review?.customer ?? undefined,
        identifier: review?.email ?? undefined,
      },
    ],
    datePublished: review?.reviewDate ?? undefined,
    reviewBody: review?.review ?? undefined,
    reviewRating: {
      "@type": "AggregateRating" as const,
      bestRating: 5,
      worstRating: 1,
      ratingValue: review?.rating ?? undefined,
      ratingCount: 1,
    },
  })) ?? [];

  const isSimilarTo = product.similarProducts?.map((p) =>
    toProduct(p!, { base })
  );

  const productSelected = products.find((v) => {
    return Number(v.productID) === Number(productId);
  }) ?? {};

  const aggregateRating = (product.numberOfVotes ||
      (product as SingleProductFragment).reviews?.length)
    ? {
      "@type": "AggregateRating" as const,
      bestRating: 5,
      ratingCount: product.numberOfVotes || undefined,
      ratingValue: product.averageRating ?? undefined,
      reviewCount: (product as SingleProductFragment).reviews?.length,
      worstRating: 1,
    }
    : undefined;

  return {
    "@type": "Product",
    url: getproductUrl(product, base).href,
    gtin: product.ean,
    sku: product.sku,
    description: product.description,
    productID: product.id,
    name: product.name,
    inProductGroupWithID: product.id,
    image: !images?.length ? [DEFAULT_IMAGE] : images,
    brand: {
      "@type": "Brand",
      name: product.productBrand?.name ?? undefined,
      url: product.productBrand?.alias
        ? new URL(`/${product.productBrand.alias}`, base).href
        : undefined,
      logo: product.productBrand?.fullUrlLogo ??
        undefined,
    },
    offers: {
      "@type": "AggregateOffer",
      highPrice: product.prices?.price,
      lowPrice: product.prices?.price,
      priceCurrency: "BRL",
      offerCount: 1,
      offers: [{
        "@type": "Offer",
        seller: product.seller?.name ?? undefined,
        price: product.prices?.price,
        priceSpecification,
        itemCondition: CONDITIONS[product.condition!],
        availability: product.available
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        inventoryLevel: { value: product.stock },
      }],
    },
    ...productSelected,
    additionalProperty,
    isSimilarTo,
    review,
    aggregateRating,
    isVariantOf: {
      "@type": "ProductGroup",
      url: getProductUrl(product, base).href,
      name: product.productName ?? undefined,
      productGroupID: product.productId,
      hasVariant: products,
      additionalProperty: [],
    },
  };
};
