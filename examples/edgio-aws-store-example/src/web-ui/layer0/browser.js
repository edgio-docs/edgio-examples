import installDevtools from "@layer0/devtools/install";
import install from "@layer0/prefetch/window/install";

document.addEventListener("DOMContentLoaded", () => {
  console.info("[layer0 browser] DOMContentLoaded -> running install()");
  install({
    forcePrefetchRatio: 0,
  });
  console.info("[layer0 browser] DOMContentLoaded -> running installDevtools()");
  installDevtools();
});
