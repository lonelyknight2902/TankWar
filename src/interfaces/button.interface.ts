import { IContainerConstructor } from "./container.interface";

export interface IButtonConstructor extends IContainerConstructor {
    text?: string
    icon?: string
    callback: Function
    type: string
    hoverType?: string,
    width?: number
    height?: number
}