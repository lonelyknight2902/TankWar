import { IMedal } from '../../interfaces/medal.interface'

class MedalPopup extends Phaser.GameObjects.Container {
    private medal: Phaser.GameObjects.Sprite
    private text: Phaser.GameObjects.Text
    private score: Phaser.GameObjects.Text
    constructor(aParams: IMedal) {
        super(aParams.scene, aParams.x, aParams.y, aParams.children)
        this.medal = this.scene.add.sprite(0, 0, aParams.medal ? aParams.medal : 'goldMedal')
        if (aParams.text) {
            this.text = this.scene.add.text(0, 0, aParams.text, {
                color: '#ffffff',
                fontSize: '48px',
                fontFamily: 'Helvetica',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 15
            })
            this.text.setOrigin(1, 0)
            this.add(this.text)
        }
        if (aParams.score) {
            this.score = this.scene.add.text(0, 0, aParams.score, {
                color: '#ffffff',
                fontSize: '24px',
                fontFamily: 'Helvetica',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 10
            })
            this.score.setOrigin(0, 1)
            this.add(this.score)
        }
        this.add(this.medal)
        if (aParams.width && aParams.height) {
            this.setSize(aParams.width, aParams.height)
            this.medal.setScale(aParams.height / this.medal.height)
        } else {
            this.setSize(300, 300)
        }
        Phaser.Display.Align.In.LeftCenter(this.medal, this)
        Phaser.Display.Align.In.TopRight(this.text, this)
        Phaser.Display.Align.In.BottomRight(this.score, this)
        this.score.x = this.text.x - this.text.width

        this.scene.add.existing(this)
    }
}

export default MedalPopup
