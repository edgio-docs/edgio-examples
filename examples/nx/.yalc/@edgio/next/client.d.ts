export interface NextURLParams {
    /**
     * The URL path
     */
    href: string;
    /**
     * The values of any route params within the URL.
     */
    routeParams: {
        [name: string]: string;
    } | undefined;
    /**
     * The current locale (only needed when using localization)
     */
    locale?: string;
}
/**
 * Creates the URL that Next.js will use to fetch data from getServerSideProps
 * So for example, if you have a file /products/[productId].js,
 * you would call createNextDataURL({ href: '/products/1', routeParams: { productId: '1' }}).
 * This function will only return a value on the client. It will return undefined on the server.
 *
 * Example usage with @edgio/react/Prefetch:
 *
 * ```js
 *  import { Prefetch } from '@edgio/react'
 *  import { createNextDataURL } from '@edgio/next/client'
 *
 *  <Link href={product.url}>
 *    <Prefetch url={createNextDataURL({ href: product.url, routeParams: { productId: product.id } })}>
 *      <a>Red Shirt</a>
 *    </Prefetch>
 *  </Link>
 * ```
 *
 * @param params
 * @returns
 */
export declare function createNextDataURL(params: NextURLParams): string | undefined;
