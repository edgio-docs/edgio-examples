import { DeploymentBuilder } from '@edgio/core/deploy';
/**
 * Configure SSG pages to expire based on the revalidate time returned by getStaticProps, which
 * is stored in .next/prerender-manifest.json
 */
export default function setSsgStaticAssetExpiration(builder: DeploymentBuilder, prerenderManifest: {
    [key: string]: any;
}, distDir: string, defaultLocale?: string): void;
