export declare const getServerBuildAvailability: ({ config, quiet, }: {
    config: {
        target?: string | undefined;
    };
    quiet?: boolean | undefined;
}) => {
    serverBuildAvailable: boolean;
    useServerBuild: boolean;
    standaloneBuildConfig: any;
};
