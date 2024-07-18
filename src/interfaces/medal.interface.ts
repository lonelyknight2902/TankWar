import { IContainerConstructor } from "./container.interface";

export interface IMedal extends IContainerConstructor {
    text?: string
    score?: string
    width?: number
    height?: number
    medal?: string
}