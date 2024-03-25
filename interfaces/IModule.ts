export interface IModule {
    name: string,
    path: string,
    fn: () => string
}