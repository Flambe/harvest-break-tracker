export default interface ConfigurationInterface {
    needsConfiguring(): Promise<boolean>;

    run(): Promise<void>;
}