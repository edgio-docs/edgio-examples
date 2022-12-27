import { Prefetcher } from "@layer0/prefetch/sw";
import { clientsClaim, skipWaiting } from "workbox-core";

skipWaiting();
clientsClaim();

new Prefetcher().route();
