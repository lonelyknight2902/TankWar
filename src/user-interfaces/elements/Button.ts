import { IButtonConstructor } from '../../interfaces/button.interface'

class Button extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.NineSlice
    private hoverBackground: Phaser.GameObjects.NineSlice
    private text: Phaser.GameObjects.Text
    private icon: Phaser.GameObjects.Image
    private content: Phaser.GameObjects.Container
    private callback: Function

    constructor(aParams: IButtonConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.children)
        const { type, hoverType, icon, text, callback, width, height } = aParams
        this.background = this.scene.add.nineslice(0, 0, type, 0, 0, 0, 10, 10, 10, 10)
        this.add(this.background)
        if (hoverType) {
            this.hoverBackground = this.scene.add.nineslice(
                0,
                0,
                hoverType,
                0,
                0,
                0,
                10,
                10,
                10,
                10
            )
            this.add(this.hoverBackground)
            this.hoverBackground.setVisible(false)
        }
        if (text) {
            this.text = this.scene.add.text(0, 0, text, {
                color: '#16bb77',
                fontSize: '32px',
                fontFamily: 'Helvetica',
                fontStyle: 'bold',
            })
            this.add(this.text)
        }
        if (icon) {
            this.icon = this.scene.add.image(0, 0, icon)
            this.icon.setTintFill(0x16bb77)
            this.add(this.icon)
        }
        if (width) {
            this.background.width = width
            if (this.hoverBackground) this.hoverBackground.width = width
        }

        if (height) {
            this.background.height = height
            if (this.hoverBackground) this.hoverBackground.height = height
        }
        if (text && icon) {
            console.log('both')
            this.text.setAlign('right')
            // this.background.width = this.text.width + this.icon.width + 40
            // this.background.height = this.text.height + 40
            // if (this.hoverBackground) {
            //     this.hoverBackground.width = this.text.width + this.icon.width + 40
            //     this.hoverBackground.height = this.text.height + 40
            // }
            Phaser.Display.Align.In.LeftCenter(this.icon, this.background, -10, 0)
            Phaser.Display.Align.In.LeftCenter(this.text, this.background, -20 - this.icon.width, 0)
        } else if (text) {
            // this.background.width = this.text.width + 40
            // this.background.height = this.text.height + 40
            // if (this.hoverBackground) {
            //     this.hoverBackground.width = this.text.width + 40
            //     this.hoverBackground.height = this.text.height + 40
            // }
            console.log('text')
            Phaser.Display.Align.In.Center(this.text, this.background)
        } else if (icon) {
            // this.background.width = this.icon.width + 40
            // this.background.height = this.icon.height + 40
            // if (this.hoverBackground) {
            //     this.hoverBackground.width = this.icon.width + 40
            //     this.hoverBackground.height = this.icon.height + 40
            // }
            console.log('icon')
            Phaser.Display.Align.In.Center(this.icon, this.background)
        }
        this.callback = callback

        this.setSize(this.background.displayWidth, this.background.displayHeight)
        // const rect = new Phaser.Geom.Rectangle(0, 0, this.background.width, this.background.height)
        this.setInteractive({ cursor: 'url(assets/cursors/hand_point.png), pointer' }).on(
            'pointerdown',
            () => {
                console.log('click')
                this.setY(this.y + 5)
            }
        )

        this.on('pointerup', () => {
            this.callback()
            this.setY(this.y - 5)
        })
        this.on('pointerover', () => {
            if (this.hoverBackground) {
                this.background.setVisible(false)
                this.hoverBackground.setVisible(true)
            } else {
                this.background.setTint(0x16bb77)
            }
            if (this.icon) this.icon.clearTint()
            if (this.text) this.text.setColor('#fff')
            // this.scene.input.setDefaultCursor('pointer')
        })

        this.on('pointerout', () => {
            if (this.hoverBackground) {
                this.background.setVisible(true)
                this.hoverBackground.setVisible(false)
            } else {
                this.background.clearTint()
            }
            if (this.icon) this.icon.setTintFill(0x16bb77)
            if (this.text) this.text.setColor('#16bb77')
            // this.scene.input.setDefaultCursor('auto')
            console.log('pointerout')
        })
        this.setScrollFactor(0)
        this.scene.add.existing(this)
    }

    public getIcon(): Phaser.GameObjects.Image {
        return this.icon
    }
}

export default Button
