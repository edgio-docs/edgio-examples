import installDevtools from "@edgio/devtools/install";
import install from "@edgio/prefetch/window/install";

document.addEventListener("DOMContentLoaded", () => {
  console.info("[layer0 browser] DOMContentLoaded -> running install()");
  install({
    forcePrefetchRatio: 0.5, // forcely prefetch 50% of non-cached content for higher hit rate
  });
  console.info(
    "[layer0 browser] DOMContentLoaded -> running installDevtools()"
  );
  installDevtools();
});
