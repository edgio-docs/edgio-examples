import { Prefetcher } from "@edgio/prefetch/sw";
import { clientsClaim, skipWaiting } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";
import DeepFetchPlugin, {
  DeepFetchCallbackParam,
} from "@edgio/prefetch/sw/DeepFetchPlugin";
import { prefetch } from "@edgio/prefetch/window/prefetch";

skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST || []);

new Prefetcher({
  plugins: [
    new DeepFetchPlugin([
      {
        selector: "body",
        maxMatches: 1,
        attribute: "src",
        as: "image",
        callback: deepFetchPDPJson,
      },
      {
        jsonQuery:
          "hits.hits.[**]._source.configurable_children.[**].image:fixUrl",
        jsonQueryOptions: {
          locals: {
            fixUrl: (result) =>
              result.map((url) => "/img/600/744/resize" + url),
          },
        },
        maxMatches: 2,
        as: "image",
      },
    ]),
  ],
}).route();

function deepFetchPDPJson({ $el, el, $, srcURL } = DeepFetchCallbackParam) {
  if (srcURL.match(/childSku=.+?-/)) {
    const sku = srcURL
      .match(/childSku=.+?-/)[0]
      .replace("childSku=", "")
      .replace("-", "");
    prefetch(
      `/api/catalog/vue_storefront_catalog/product/_search?_source_exclude=attribute_set_id%2Ccreated_at%2Chas_options%2Cmsrp_display_actual_price_type%2C%2A.msrp_display_actual_price_type%2Coptions_container%2Crequired_options%2Csmall_image%2Cstock.enable_qty_increments%2Cstock.is_decimal_divided%2Cstock.manage_stock%2Cstock.notify_stock_qty%2Cstock.qty_increments%2Cstock.show_default_notification_message%2Cstock.stock_id%2Cstock.stock_status_changed_auto%2Cstock.use_config_qty_increments%2Cstock.use_config_min_qty%2Cstock.use_config_notify_stock_qty%2Cstock.use_config_backorders%2Cstock.use_config_enable_qty_inc%2Cstock.use_config_manage_stock%2Cstock.use_config_min_sale_qty%2Cstock.use_config_max_sale_qty%2Csgn%2C%2A.sgn%2Cupdated_at&from=0&request=%7B%22query%22%3A%7B%22bool%22%3A%7B%22filter%22%3A%7B%22terms%22%3A%7B%22sku%22%3A%5B%22${sku}%22%5D%7D%7D%7D%7D%7D&size=1&sort=`,
      "fetch"
    );
  }
}
