import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../constants'
import { IContainerConstructor } from '../interfaces/container.interface'
import { GameScene } from '../scenes'
import { Button } from './elements'

class GameUI extends Phaser.GameObjects.Container {
    private pauseButton: Button
    constructor(aParams: IContainerConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.children)
        this.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)
        this.setScrollFactor(0)
        // this.setInteractive()
        this.pauseButton = new Button({
            scene: aParams.scene,
            x: 0,
            y: 0,
            type: 'buttonSquareDepthBorder',
            hoverType: 'buttonSquareDepthFlat',
            icon: 'pause',
            callback: () => {
                console.log('pause')
                const scene = this.scene as GameScene
                scene.getStateMachine().transition('pause')
            },
            width: 80,
            height: 80,
        })
        this.add(this.pauseButton)
        Phaser.Display.Align.In.TopRight(
            this.pauseButton,
            this.scene.add.zone(this.scene.cameras.main.width, 0, 0, 0),
            -10,
            -10
        )
        this.scene.add.existing(this)
    }
}

export default GameUI
