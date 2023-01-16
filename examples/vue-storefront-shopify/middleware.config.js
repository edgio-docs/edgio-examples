module.exports = {
  integrations: {
    shopify: {
      location: '@vue-storefront/shopify-api/server',
      configuration: {
        api: {
          domain: 'puredailycare.com',
          storefrontAccessToken: '990e49e1737e0593cadee15ede4b2972'
        },
        currency: 'USD',
        country: 'US'
      }
    }
  }
};
