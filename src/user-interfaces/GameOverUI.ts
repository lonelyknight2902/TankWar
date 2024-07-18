import { IContainerConstructor } from "../interfaces/container.interface"
import { GameOverPopup } from "./elements"

class GameOverUI extends Phaser.GameObjects.Container {
    private popup: Phaser.GameObjects.Container
    constructor(aParams: IContainerConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.children)
        this.setSize(aParams.scene.sys.canvas.width, aParams.scene.sys.canvas.height)
        this.setScrollFactor(0)
        this.popup = new GameOverPopup({
            scene: aParams.scene,
            x: 0,
            y: 0,
        })
        this.add(this.popup)
        Phaser.Display.Align.In.Center(this.popup, this.scene.add.zone(this.scene.cameras.main.width / 2, this.scene.cameras.main.height / 2, 0, 0))
        this.setDepth(10)
        this.scene.add.existing(this)
    }

    display(): void {
        (this.popup as GameOverPopup).displayScore()
    }
}

export default GameOverUI
