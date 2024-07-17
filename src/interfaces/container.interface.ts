export interface IContainerConstructor {
    scene: Phaser.Scene
    x: number
    y: number
    children?: Phaser.GameObjects.GameObject[]
}