export const getCustomerIdQuery = /* GraphQL */ `
  query getCustomerId {
    customer {
      entityId
    }
  }
`;
async function getCustomerId({ customerToken , config  }) {
    var ref;
    const { data  } = await config.fetch(getCustomerIdQuery, undefined, {
        headers: {
            cookie: `${config.customerCookie}=${customerToken}`
        }
    });
    return String(data === null || data === void 0 ? void 0 : (ref = data.customer) === null || ref === void 0 ? void 0 : ref.entityId);
}
export default getCustomerId;
