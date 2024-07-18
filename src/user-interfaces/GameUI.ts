import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../constants'
import { IContainerConstructor } from '../interfaces/container.interface'
import ScoreManager from '../managers/ScoreManager'
import { GameScene } from '../scenes'
import { Button, MedalPopup } from './elements'

class GameUI extends Phaser.GameObjects.Container {
    private pauseButton: Button
    private medal: MedalPopup
    private score: Phaser.GameObjects.Text
    private currentScore: number
    private scoreManager: ScoreManager
    private updatingScore: boolean
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
        this.medal = new MedalPopup({
            scene: aParams.scene,
            x: 0,
            y: 0,
            medal: 'goldMedal',
            score: '+100',
            text: 'Enemy Killed',
            height: 100,
            width: 400,
        })
        this.score = this.scene.add.text(10, 10, 'Score: 0', {
            fontFamily: 'Helvetica',
            fontStyle: 'bold',
            fontSize: 48,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 10,
        })
        this.add(this.pauseButton)
        this.add(this.medal)
        this.add(this.score)
        this.scoreManager = ScoreManager.getInstance()
        this.currentScore = 0
        this.updatingScore = false
        Phaser.Display.Align.In.TopRight(
            this.pauseButton,
            this.scene.add.zone(this.scene.cameras.main.width, 0, 0, 0),
            -10,
            -10
        )
        Phaser.Display.Align.In.TopCenter(
            this.medal,
            this.scene.add.zone(this.scene.cameras.main.width / 2, 0, 0, 0),
            0,
            200
        )

        Phaser.Display.Align.In.TopLeft(this.score, this.scene.add.zone(0, 0, 0, 0), -10, -10)
        this.scene.add.existing(this)
    }

    public update(time: number, delta: number): void {
        const newScore = this.scoreManager.getScore()
        if (newScore !== this.currentScore && !this.updatingScore) {
            this.updatingScore = true
            this.scene.tweens.addCounter({
                from: this.currentScore,
                to: newScore,
                duration: 100,
                onUpdate: (tween) => {
                    this.currentScore = Math.floor(tween.getValue())
                    this.score.text = `Score: ${this.currentScore}`
                },
                onComplete: () => {
                    this.updatingScore = false
                }
            })
        }
    }

    public showMedal() {
        this.scene.tweens.add({
            targets: this.medal,
            y: 250,
            duration: 500,
            ease: 'Quad.easeOut',
            repeat: 0,
            yoyo: false,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.medal,
                    y: -150,
                    duration: 500,
                    ease: 'Quad.easeIn',
                    repeat: 0,
                    delay: 2000,
                    yoyo: false,
                })
            },
        })
    }
}

export default GameUI
