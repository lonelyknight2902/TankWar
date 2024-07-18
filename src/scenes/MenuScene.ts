import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../constants'

class MenuScene extends Phaser.Scene {
    private startKey: Phaser.Input.Keyboard.Key
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = []
    private menuMusics: Phaser.Sound.BaseSound[]
    private currentMusic: Phaser.Sound.BaseSound
    private start: boolean

    constructor() {
        super({
            key: 'MenuScene',
        })
        this.start = false
    }

    init(): void {
        if (this.input.keyboard) {
            this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
            this.startKey.isDown = false
        }

        this.menuMusics = [this.sound.add('music1'), this.sound.add('music2')]
    }

    create(): void {
        const background = this.add.image(SCREEN_WIDTH / 2 + 100, SCREEN_HEIGHT / 2, 'wallpaper')
        background.setOrigin(0.5)
        background.setScale(SCREEN_HEIGHT / background.height)
        this.bitmapTexts.push(
            this.add
                .bitmapText(
                    200,
                    this.sys.canvas.height / 2 + 300,
                    'font',
                    'NOTHING HAPPENED IN NINETEEN EIGHTY-NINE',
                    30
                )
                .setTint(0xff0000)
        )

        const text = this.add
            .bitmapText(200, this.sys.canvas.height / 2 + 400, 'font', 'PRESS S TO PLAY', 30)
            .setTint(0xff0000)

        this.tweens.add({
            targets: text,
            alpha: 0,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
        })

        this.bitmapTexts.push(text)

        this.bitmapTexts.push(
            this.add
                .bitmapText(200, this.sys.canvas.height / 2 + 200, 'font', 'TANK WAR', 100)
                .setTint(0xff0000)
        )
        this.currentMusic = this.menuMusics[Phaser.Math.RND.between(0, this.menuMusics.length - 1)]
        this.currentMusic.play()
    }

    update(): void {
        if (!this.currentMusic.isPlaying && !this.start) {
            this.currentMusic =
                this.menuMusics[Phaser.Math.RND.between(0, this.menuMusics.length - 1)]
            this.currentMusic.play()
        }
        if (this.startKey.isDown && !this.start) {
            this.start = true
            // this.sound.pauseAll()
            this.cameras.main.fadeOut(500)
            this.cameras.main.once('camerafadeoutcomplete', () => {
                // this.start = false
                this.shutdown()
                this.scene.start('GameScene')
            })
        }
    }

    shutdown(): void {
        this.currentMusic.stop()
    }
}

export default MenuScene
