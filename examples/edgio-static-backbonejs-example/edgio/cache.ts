const TIME_1H = 60 * 60
const TIME_1D = TIME_1H * 24

export const STATIC_ASSET_CACHE = {
  edge: {
    maxAgeSeconds: TIME_1D * 10,
    staleWhileRevalidateSeconds: TIME_1D,
  },
}
