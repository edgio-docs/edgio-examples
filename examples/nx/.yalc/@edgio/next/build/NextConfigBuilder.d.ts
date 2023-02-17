import { DeploymentBuilder } from '@edgio/core/deploy';
/**
 *  NextConfigBuilder creates the buildtime version and runtime version of next.config.js file.
 *  The runtime version is the original version of next.config.js file.
 *
 *  This nextConfigHandler serves Next config.
 *  For performance reason when no publicRuntimeConfig or serverRuntimeConfig property is presented,
 *  only the buildtime version of config is returned, otherwise the runtime version is evaluated
 *  and publicRuntimeConfig and serverRuntimeConfig properties added.
 */
export default class NextConfigBuilder {
    protected builder: DeploymentBuilder;
    protected useServerBuild: boolean;
    protected generateSourceMap: boolean;
    protected distDir: string;
    protected ignoredDependencies: string[];
    constructor(builder: DeploymentBuilder, options: {
        useServerBuild: boolean;
        generateSourceMap: boolean;
        distDir: string;
    });
    /**
     * Returns the list of next.config.js file dependencies
     * @return
     */
    protected getDependencies(): Promise<string[]>;
    /**
     * Copies the dependencies to lambda folder
     * @return
     */
    protected copyDependencies(dependencies: string[]): Promise<void>;
    /**
     * Creates the file with runtime version of next.config.js.
     * This file is same as the original one.
     * @return
     */
    protected writeRuntimeVersion(): Promise<void>;
    /**
     * Creates the file with buildtime version of next.config.js.
     * @return
     */
    protected writeBuildtimeVersion(): Promise<void>;
    /**
     * Creates the file with our handler which will return the next config.
     * @return
     */
    writeHandler(): Promise<void>;
    /**
     * Executes the build of next config file and bundle nextConfigHandler together with buildtime version of next.config.js.
     * Then clean after ourselves.
     * @return
     */
    build(): Promise<void>;
    /**
     * Removes the unsed files after the build
     * @return
     */
    protected cleanAfterBuild(): void;
}
