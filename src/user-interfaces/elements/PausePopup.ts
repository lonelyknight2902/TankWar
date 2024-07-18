import { IContainerConstructor } from '../../interfaces/container.interface'
import { GameScene } from '../../scenes'
import Button from './Button'

class PausePopup extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.NineSlice
    private continueButton: Phaser.GameObjects.Container
    private newGameButton: Phaser.GameObjects.Container
    private audioButton: Phaser.GameObjects.Container
    constructor(aParams: IContainerConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.children)
        // this.background = aParams.scene.add.image(0, 0, 'buttonRectangleDepthLine')
        this.background = aParams.scene.add.nineslice(
            0,
            0,
            'buttonRectangleDepthLine',
            0,
            600,
            400,
            10,
            10,
            10,
            10
        )
        // this.background.width = 500
        // this.background.height = 900
        // this.background.setScale(5, 10)
        const pauseText = aParams.scene.add.text(0, 0, 'Pause', {
            color: '#ffffff',
            fontSize: '64px',
            fontFamily: 'Helvetica',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 20,
        })
        this.continueButton = new Button({
            scene: aParams.scene,
            x: 0,
            y: 0,
            type: 'buttonRectangleDepthBorder',
            hoverType: 'buttonRectangleDepthFlat',
            icon: 'forward',
            text: 'Continue',
            callback: () => {
                console.log('continue')
                const scene = this.scene as GameScene
                scene.getStateMachine().transition('play')
            },
            width: 250,
            height: 80,
        })
        this.newGameButton = new Button({
            scene: aParams.scene,
            x: 0,
            y: 0,
            type: 'buttonRectangleDepthBorder',
            hoverType: 'buttonRectangleDepthFlat',
            icon: 'return',
            text: 'New Game',
            callback: () => {
                console.log('new game')
                this.scene.cameras.main.fadeOut(500, 0, 0, 0)
                this.scene.cameras.main.once(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        this.scene.scene.restart()
                    }
                )
            },
            width: 250,
            height: 80,
        })
        this.audioButton = new Button({
            scene: aParams.scene,
            x: 0,
            y: 0,
            type: 'buttonRectangleDepthBorder',
            hoverType: 'buttonRectangleDepthFlat',
            icon: 'audioOn',
            callback: () => {
                console.log('audio')
                const audioButton = this.audioButton as Button
                const icon = audioButton.getIcon()
                if (icon.texture.key === 'audioOn') {
                    icon.setTexture('audioOff')
                    this.scene.sound.mute = true
                } else {
                    icon.setTexture('audioOn')
                    this.scene.sound.mute = false
                }
            },
            width: 80,
            height: 80,
        })
        Phaser.Display.Align.In.TopCenter(pauseText, this.background, 0, -50)
        Phaser.Display.Align.In.Center(this.audioButton, this.background, 0, 0)
        Phaser.Display.Align.In.BottomLeft(this.continueButton, this.background, -30, -50)
        Phaser.Display.Align.In.BottomRight(this.newGameButton, this.background, -30, -50)
        this.setSize(this.background.displayWidth, this.background.displayHeight)
        this.setScrollFactor(0)
        this.setInteractive()
        this.background.setDepth(10)
        this.add(this.background)
        this.add(pauseText)
        this.add(this.continueButton)
        this.add(this.newGameButton)
        this.add(this.audioButton)
        this.setDepth(10)
        this.scene.add.existing(this)
    }
}

export default PausePopup
