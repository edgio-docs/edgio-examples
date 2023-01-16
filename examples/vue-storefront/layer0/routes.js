import { Router } from "@edgio/core/router";
import { CACHE_ASSETS, CACHE_PAGES } from "./cache";

const DIST_APP = "dist";
const DIST_layer0_CLIENT = "dist-layer0-client";
const DIST_layer0_ASSETS = "dist-layer0-assets";

const SPLAT = ":path*";
const SUFFIX_SPLAT = `:suffix/${SPLAT}`;

// //////////////////////////////////////////

const router = new Router();

const pages = [
  // home
  `/`,
  // plp
  `/men.html`,
  `/men${SUFFIX_SPLAT}`,
  `/women.html`,
  `/women${SUFFIX_SPLAT}`,
  `/gear.html`,
  `/gear${SUFFIX_SPLAT}`,
  `/training.html`,
  `/training${SUFFIX_SPLAT}`,
  // other
  `/sale`,
  `/sale${SUFFIX_SPLAT}`,
  `/about-us`,
  `/about-us${SUFFIX_SPLAT}`,
  `/i/about-us`,
  `/i/about-us${SUFFIX_SPLAT}`,
  `/i/customer-service`,
  `/i/customer-service${SUFFIX_SPLAT}`,
  `/store-locator`,
  `/store-locator${SUFFIX_SPLAT}`,
  `/delivery`,
  `/delivery${SUFFIX_SPLAT}`,
  `/returns`,
  `/returns${SUFFIX_SPLAT}`,
  `/privacy`,
  `/privacy${SUFFIX_SPLAT}`,
  `/size-guide`,
  `/size-guide${SUFFIX_SPLAT}`,
  `/contact`,
  `/contact${SUFFIX_SPLAT}`,
  // pdp
  `/abominable-${SUFFIX_SPLAT}`,
  `/adrienne-${SUFFIX_SPLAT}`,
  `/advanced-${SUFFIX_SPLAT}`,
  `/aeon-${SUFFIX_SPLAT}`,
  `/aero-${SUFFIX_SPLAT}`,
  `/aether-${SUFFIX_SPLAT}`,
  `/affirm-${SUFFIX_SPLAT}`,
  `/aim-${SUFFIX_SPLAT}`,
  `/ajax-${SUFFIX_SPLAT}`,
  `/ana-${SUFFIX_SPLAT}`,
  `/angel-${SUFFIX_SPLAT}`,
  `/antonia-${SUFFIX_SPLAT}`,
  `/apollo-${SUFFIX_SPLAT}`,
  `/arcadio-${SUFFIX_SPLAT}`,
  `/argus-${SUFFIX_SPLAT}`,
  `/ariel-${SUFFIX_SPLAT}`,
  `/artemis-${SUFFIX_SPLAT}`,
  `/atlas-${SUFFIX_SPLAT}`,
  `/atomic-${SUFFIX_SPLAT}`,
  `/augusta-${SUFFIX_SPLAT}`,
  `/autumn-${SUFFIX_SPLAT}`,
  `/bag/endeavor-${SUFFIX_SPLAT}`,
  `/balboa-${SUFFIX_SPLAT}`,
  `/bardot-${SUFFIX_SPLAT}`,
  `/beaumont-${SUFFIX_SPLAT}`,
  `/beginner-${SUFFIX_SPLAT}`,
  `/bella-${SUFFIX_SPLAT}`,
  `/bess-${SUFFIX_SPLAT}`,
  `/bolo-${SUFFIX_SPLAT}`,
  `/breathe-${SUFFIX_SPLAT}`,
  `/bruno-${SUFFIX_SPLAT}`,
  `/caesar-${SUFFIX_SPLAT}`,
  `/carina-${SUFFIX_SPLAT}`,
  `/cassia-${SUFFIX_SPLAT}`,
  `/cassius-${SUFFIX_SPLAT}`,
  `/celeste-${SUFFIX_SPLAT}`,
  `/chaz-${SUFFIX_SPLAT}`,
  `/chloe-${SUFFIX_SPLAT}`,
  `/circe-${SUFFIX_SPLAT}`,
  `/clamber-${SUFFIX_SPLAT}`,
  `/cobalt-${SUFFIX_SPLAT}`,
  `/compete-${SUFFIX_SPLAT}`,
  `/cora-${SUFFIX_SPLAT}`,
  `/cronus-${SUFFIX_SPLAT}`,
  `/crown-${SUFFIX_SPLAT}`,
  `/cruise-${SUFFIX_SPLAT}`,
  `/daphne-${SUFFIX_SPLAT}`,
  `/daria-${SUFFIX_SPLAT}`,
  `/dash-${SUFFIX_SPLAT}`,
  `/deion-${SUFFIX_SPLAT}`,
  `/deirdre-${SUFFIX_SPLAT}`,
  `/desiree-${SUFFIX_SPLAT}`,
  `/diana-${SUFFIX_SPLAT}`,
  `/didi-${SUFFIX_SPLAT}`,
  `/diva-${SUFFIX_SPLAT}`,
  `/driven-${SUFFIX_SPLAT}`,
  `/dual-${SUFFIX_SPLAT}`,
  `/echo-${SUFFIX_SPLAT}`,
  `/electra-${SUFFIX_SPLAT}`,
  `/elisa-${SUFFIX_SPLAT}`,
  `/emma-${SUFFIX_SPLAT}`,
  `/endurance-${SUFFIX_SPLAT}`,
  `/eos-${SUFFIX_SPLAT}`,
  `/erica-${SUFFIX_SPLAT}`,
  `/erikssen-${SUFFIX_SPLAT}`,
  `/fiona-${SUFFIX_SPLAT}`,
  `/frankie-${SUFFIX_SPLAT}`,
  `/fusion-${SUFFIX_SPLAT}`,
  `/gabrielle-${SUFFIX_SPLAT}`,
  `/geo-${SUFFIX_SPLAT}`,
  `/go-${SUFFIX_SPLAT}`,
  `/gobi-${SUFFIX_SPLAT}`,
  `/grayson-${SUFFIX_SPLAT}`,
  `/gwen-${SUFFIX_SPLAT}`,
  `/gwyn-${SUFFIX_SPLAT}`,
  `/harmony-${SUFFIX_SPLAT}`,
  `/hawkeye-${SUFFIX_SPLAT}`,
  `/helena-${SUFFIX_SPLAT}`,
  `/helios-${SUFFIX_SPLAT}`,
  `/hera-${SUFFIX_SPLAT}`,
  `/hollister-${SUFFIX_SPLAT}`,
  `/hyperion-${SUFFIX_SPLAT}`,
  `/ida-${SUFFIX_SPLAT}`,
  `/impulse-${SUFFIX_SPLAT}`,
  `/ina-${SUFFIX_SPLAT}`,
  `/inez-${SUFFIX_SPLAT}`,
  `/ingrid-${SUFFIX_SPLAT}`,
  `/iris-${SUFFIX_SPLAT}`,
  `/jade-${SUFFIX_SPLAT}`,
  `/josie-${SUFFIX_SPLAT}`,
  `/joust-${SUFFIX_SPLAT}`,
  `/juliana-${SUFFIX_SPLAT}`,
  `/juno-${SUFFIX_SPLAT}`,
  `/jupiter-${SUFFIX_SPLAT}`,
  `/karissa-${SUFFIX_SPLAT}`,
  `/karmen-${SUFFIX_SPLAT}`,
  `/kenobi-${SUFFIX_SPLAT}`,
  `/kratos-${SUFFIX_SPLAT}`,
  `/lando-${SUFFIX_SPLAT}`,
  `/layla-${SUFFIX_SPLAT}`,
  `/leah-${SUFFIX_SPLAT}`,
  `/lifelong-${SUFFIX_SPLAT}`,
  `/livingston-${SUFFIX_SPLAT}`,
  `/logan-${SUFFIX_SPLAT}`,
  `/lono-${SUFFIX_SPLAT}`,
  `/lucia-${SUFFIX_SPLAT}`,
  `/luma-${SUFFIX_SPLAT}`,
  `/mach-${SUFFIX_SPLAT}`,
  `/marco-${SUFFIX_SPLAT}`,
  `/mars-${SUFFIX_SPLAT}`,
  `/maxima-${SUFFIX_SPLAT}`,
  `/maya-${SUFFIX_SPLAT}`,
  `/meteor-${SUFFIX_SPLAT}`,
  `/miko-${SUFFIX_SPLAT}`,
  `/mimi-${SUFFIX_SPLAT}`,
  `/minerva-${SUFFIX_SPLAT}`,
  `/mona-${SUFFIX_SPLAT}`,
  `/montana-${SUFFIX_SPLAT}`,
  `/nadia-${SUFFIX_SPLAT}`,
  `/neve-${SUFFIX_SPLAT}`,
  `/nona-${SUFFIX_SPLAT}`,
  `/nora-${SUFFIX_SPLAT}`,
  `/olivia-${SUFFIX_SPLAT}`,
  `/orestes-${SUFFIX_SPLAT}`,
  `/orion-${SUFFIX_SPLAT}`,
  `/oslo-${SUFFIX_SPLAT}`,
  `/overnight-${SUFFIX_SPLAT}`,
  `/phoebe-${SUFFIX_SPLAT}`,
  `/pierce-${SUFFIX_SPLAT}`,
  `/portia-${SUFFIX_SPLAT}`,
  `/prima-${SUFFIX_SPLAT}`,
  `/primo-${SUFFIX_SPLAT}`,
  `/proteus-${SUFFIX_SPLAT}`,
  `/pursuit-${SUFFIX_SPLAT}`,
  `/push-${SUFFIX_SPLAT}`,
  `/quest-${SUFFIX_SPLAT}`,
  `/radiant-${SUFFIX_SPLAT}`,
  `/rapha-${SUFFIX_SPLAT}`,
  `/riona-${SUFFIX_SPLAT}`,
  `/rival-${SUFFIX_SPLAT}`,
  `/rocco-${SUFFIX_SPLAT}`,
  `/ryker-${SUFFIX_SPLAT}`,
  `/sahara-${SUFFIX_SPLAT}`,
  `/savvy-${SUFFIX_SPLAT}`,
  `/selene-${SUFFIX_SPLAT}`,
  `/set-${SUFFIX_SPLAT}`,
  `/sinbad-${SUFFIX_SPLAT}`,
  `/sol-${SUFFIX_SPLAT}`,
  `/solo-${SUFFIX_SPLAT}`,
  `/sparta-${SUFFIX_SPLAT}`,
  `/sprite-${SUFFIX_SPLAT}`,
  `/stark-${SUFFIX_SPLAT}`,
  `/stellar-${SUFFIX_SPLAT}`,
  `/strike-${SUFFIX_SPLAT}`,
  `/strive-${SUFFIX_SPLAT}`,
  `/summit-${SUFFIX_SPLAT}`,
  `/supernova-${SUFFIX_SPLAT}`,
  `/sybil-${SUFFIX_SPLAT}`,
  `/sylvia-${SUFFIX_SPLAT}`,
  `/taurus-${SUFFIX_SPLAT}`,
  `/teton-${SUFFIX_SPLAT}`,
  `/thorpe-${SUFFIX_SPLAT}`,
  `/tiberius-${SUFFIX_SPLAT}`,
  `/tiffany-${SUFFIX_SPLAT}`,
  `/torque-${SUFFIX_SPLAT}`,
  `/tristan-${SUFFIX_SPLAT}`,
  `/troy-${SUFFIX_SPLAT}`,
  `/typhon-${SUFFIX_SPLAT}`,
  `/viktor-${SUFFIX_SPLAT}`,
  `/voyage-${SUFFIX_SPLAT}`,
  `/vulcan-${SUFFIX_SPLAT}`,
  `/wayfarer-${SUFFIX_SPLAT}`,
  `/yoga-${SUFFIX_SPLAT}`,
  `/zeppelin-${SUFFIX_SPLAT}`,
  `/zing-${SUFFIX_SPLAT}`,
  `/zoe-${SUFFIX_SPLAT}`,
  `/zoltan-${SUFFIX_SPLAT}`,
];

// static prerendering
router.prerender(pages.filter((page) => !page.includes(SPLAT)));

// layer0 static files
router.get("/service-worker.js", ({ serviceWorker, cache }) => {
  cache(CACHE_ASSETS);
  serviceWorker(`${DIST_layer0_CLIENT}/service-worker.js`);
});
router.get("/main.js", ({ serveStatic, cache }) => {
  cache(CACHE_ASSETS);
  serveStatic(`${DIST_layer0_CLIENT}/browser.js`);
});

// assets
router.get(`/dist/${SPLAT}`, ({ serveStatic, cache }) => {
  cache(CACHE_ASSETS);
  serveStatic(`${DIST_APP}/${SPLAT}`);
});
router.get(`/assets/${SPLAT}`, ({ serveStatic, cache }) => {
  cache(CACHE_ASSETS);
  serveStatic(`${DIST_layer0_ASSETS}/${SPLAT}`);
});
router.get(`/img/${SPLAT}`, ({ proxy, cache }) => {
  cache(CACHE_ASSETS);
  proxy("origin");
});

// api
router.get(`/api/catalog/${SPLAT}`, ({ proxy, cache }) => {
  cache(CACHE_PAGES);
  proxy("origin");
});

router.get(`/api/stock/${SPLAT}`, ({ proxy, cache }) => {
  cache(CACHE_PAGES);
  proxy("origin");
});

// pages
pages.forEach((page) => {
  router.get(page, ({ cache, renderWithApp }) => {
    cache(CACHE_PAGES);
    renderWithApp();
  });
});

// fallback
router.fallback(({ renderWithApp }) => {
  renderWithApp();
});

export default router;
