declare module "*.scss" {
    const content: { [className: string]: string };
    export default content;
}

declare module "*.module.scss" {
    const classes: { readonly [key: string]: string };
    export default classes;
}
