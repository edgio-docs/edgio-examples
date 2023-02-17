import { BuildOptions } from '@edgio/core/deploy';
interface BuilderOptions {
    /**
     * The path to the Next.js source directory from the root of the app
     */
    srcDir: string;
    /**
     * The path to the Next.js dist directory from the root of the app
     */
    distDir: string;
    /**
     * The command to use to build the Next.js app
     */
    buildCommand: string;
}
/**
 * Creates a build entrypoint for a connector
 * @param param0
 */
export default function createBuildEntryPoint({ srcDir, distDir, buildCommand }: BuilderOptions): (options: BuildOptions) => Promise<void>;
export {};
