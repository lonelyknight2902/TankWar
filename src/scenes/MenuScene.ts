import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../constants'

class MenuScene extends Phaser.Scene {
    private startKey: Phaser.Input.Keyboard.Key
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = []

    constructor() {
        super({
            key: 'MenuScene',
        })
    }

    init(): void {
        if (this.input.keyboard) {
            this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
            this.startKey.isDown = false
        }
    }

    create(): void {
        const background = this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 'wallpaper')
        background.setOrigin(0.5)
        background.height = SCREEN_HEIGHT
        this.bitmapTexts.push(
            this.add.bitmapText(
                this.sys.canvas.width / 2 - 120,
                this.sys.canvas.height / 2,
                'font',
                'PRESS S TO PLAY',
                30
            )
        )

        this.bitmapTexts.push(
            this.add.bitmapText(
                this.sys.canvas.width / 2 - 120,
                this.sys.canvas.height / 2 - 100,
                'font',
                'TANK',
                100
            )
        )
    }

    update(): void {
        if (this.startKey.isDown) {
            this.cameras.main.fadeOut(500)
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('GameScene')
            })
        }
    }
}

export default MenuScene
