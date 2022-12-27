// TODO: Check nextjs-commerce bug if no images are added for a product
const placeholderImg = '/product-img-placeholder.svg';
const money = ({ amount , currency  })=>{
    return {
        value: +amount,
        currencyCode: currency || 'USD'
    };
};
const normalizeProductOptions = (options)=>{
    return options === null || options === void 0 ? void 0 : options.map((option)=>{
        return option === null || option === void 0 ? void 0 : option.attributes;
    }).flat(1).reduce((acc, x)=>{
        if (acc.find(({ displayName  })=>displayName === x.attribute.name
        )) {
            return acc.map((opt)=>{
                return opt.displayName === x.attribute.name ? {
                    ...opt,
                    values: [
                        ...opt.values,
                        ...x.values.map((value)=>{
                            return {
                                label: value === null || value === void 0 ? void 0 : value.name
                            };
                        }), 
                    ]
                } : opt;
            });
        }
        return acc.concat({
            __typename: 'MultipleChoiceOption',
            displayName: x.attribute.name,
            variant: 'size',
            values: x.values.map((value)=>{
                return {
                    label: value === null || value === void 0 ? void 0 : value.name
                };
            })
        });
    }, []);
};
const normalizeProductVariants = (variants)=>{
    return variants === null || variants === void 0 ? void 0 : variants.map((variant)=>{
        var ref, ref1;
        const { id , sku , name , pricing  } = variant;
        const price = (pricing === null || pricing === void 0 ? void 0 : (ref = pricing.price) === null || ref === void 0 ? void 0 : ref.net) && ((ref1 = money(pricing.price.net)) === null || ref1 === void 0 ? void 0 : ref1.value);
        return {
            id,
            name,
            sku: sku ?? id,
            price,
            listPrice: price,
            requiresShipping: true,
            options: normalizeProductOptions([
                variant
            ])
        };
    });
};
export function normalizeProduct(productNode) {
    var ref, ref2, ref3, ref4;
    const { id , name , media =[] , variants , description , slug , pricing , ...rest } = productNode;
    const product = {
        id,
        name,
        vendor: '',
        description: description ? (ref2 = (ref = JSON.parse(description)) === null || ref === void 0 ? void 0 : ref.blocks[0]) === null || ref2 === void 0 ? void 0 : ref2.data.text : '',
        path: `/${slug}`,
        slug: slug === null || slug === void 0 ? void 0 : slug.replace(/^\/+|\/+$/g, ''),
        price: (pricing === null || pricing === void 0 ? void 0 : (ref3 = pricing.priceRange) === null || ref3 === void 0 ? void 0 : (ref4 = ref3.start) === null || ref4 === void 0 ? void 0 : ref4.net) && money(pricing.priceRange.start.net) || {
            value: 0,
            currencyCode: 'USD'
        },
        // TODO: Check nextjs-commerce bug if no images are added for a product
        images: (media === null || media === void 0 ? void 0 : media.length) ? media : [
            {
                url: placeholderImg
            }
        ],
        variants: variants && variants.length > 0 ? normalizeProductVariants(variants) : [],
        options: variants && variants.length > 0 ? normalizeProductOptions(variants) : [],
        ...rest
    };
    return product;
}
export function normalizeCart(checkout) {
    var ref, ref5, ref6, ref7, ref8, ref9;
    const lines = checkout.lines;
    const lineItems = lines.length > 0 ? lines === null || lines === void 0 ? void 0 : lines.map(normalizeLineItem) : [];
    return {
        id: checkout.id,
        customerId: '',
        email: '',
        createdAt: checkout.created,
        currency: {
            code: (ref = checkout.totalPrice) === null || ref === void 0 ? void 0 : ref.currency
        },
        taxesIncluded: false,
        lineItems,
        lineItemsSubtotalPrice: (ref5 = checkout.subtotalPrice) === null || ref5 === void 0 ? void 0 : (ref6 = ref5.gross) === null || ref6 === void 0 ? void 0 : ref6.amount,
        subtotalPrice: (ref7 = checkout.subtotalPrice) === null || ref7 === void 0 ? void 0 : (ref8 = ref7.gross) === null || ref8 === void 0 ? void 0 : ref8.amount,
        totalPrice: (ref9 = checkout.totalPrice) === null || ref9 === void 0 ? void 0 : ref9.gross.amount,
        discounts: []
    };
}
function normalizeLineItem({ id , variant , quantity  }) {
    var ref, ref10, ref11;
    return {
        id,
        variantId: String(variant === null || variant === void 0 ? void 0 : variant.id),
        productId: String(variant === null || variant === void 0 ? void 0 : variant.id),
        name: `${variant.product.name}`,
        quantity,
        variant: {
            id: String(variant === null || variant === void 0 ? void 0 : variant.id),
            sku: (variant === null || variant === void 0 ? void 0 : variant.sku) ?? '',
            name: variant === null || variant === void 0 ? void 0 : variant.name,
            image: {
                url: (variant === null || variant === void 0 ? void 0 : variant.media[0]) ? variant === null || variant === void 0 ? void 0 : variant.media[0].url : placeholderImg
            },
            requiresShipping: false,
            price: variant === null || variant === void 0 ? void 0 : (ref = variant.pricing) === null || ref === void 0 ? void 0 : (ref10 = ref.price) === null || ref10 === void 0 ? void 0 : ref10.gross.amount,
            listPrice: 0
        },
        path: String(variant === null || variant === void 0 ? void 0 : (ref11 = variant.product) === null || ref11 === void 0 ? void 0 : ref11.slug),
        discounts: [],
        options: []
    };
}
