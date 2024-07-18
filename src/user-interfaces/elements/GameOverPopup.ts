import { IContainerConstructor } from '../../interfaces/container.interface'
import ScoreManager from '../../managers/ScoreManager'
import Button from './Button'

class GameOverPopup extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.NineSlice
    private newGameButton: Phaser.GameObjects.Container
    private menuButton: Phaser.GameObjects.Container
    private scoreText: Phaser.GameObjects.Text
    private highScoreText: Phaser.GameObjects.Text
    private scoreManager: ScoreManager
    constructor(aParams: IContainerConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.children)
        this.background = aParams.scene.add.nineslice(
            0,
            0,
            'buttonRectangleDepthLine',
            0,
            600,
            700,
            10,
            10,
            10,
            10
        )
        const gameOverText = aParams.scene.add.text(0, 0, 'Game Over', {
            color: '#ffffff',
            fontSize: '64px',
            fontFamily: 'Helvetica',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 20,
        })

        const scoreLabel = aParams.scene.add.text(0, 0, 'Score', {
            color: '#000000',
            fontSize: '32px',
            fontFamily: 'Helvetica',
            fontStyle: 'bold',
        })

        scoreLabel.setOrigin(0.5)

        this.scoreText = aParams.scene.add.text(0, 0, `0`, {
            color: '#ffffff',
            fontSize: '48px',
            fontFamily: 'Helvetica',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 10,
        })

        this.scoreText.setOrigin(0.5)

        const highScoreLabel = aParams.scene.add.text(0, 0, 'High Score', {
            color: '#000000',
            fontSize: '32px',
            fontFamily: 'Helvetica',
            fontStyle: 'bold',
        })

        highScoreLabel.setOrigin(0.5)

        this.highScoreText = aParams.scene.add.text(0, 0, `0`, {
            color: '#ffffff',
            fontSize: '48px',
            fontFamily: 'Helvetica',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 10,
        })

        this.highScoreText.setOrigin(0.5)

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
                    (
                        cam: Phaser.Cameras.Scene2D.Camera,
                        effect: Phaser.Cameras.Scene2D.Effects.Fade
                    ) => {
                        this.scene.scene.restart()
                    }
                )
            },
            width: 250,
            height: 80,
        })
        this.menuButton = new Button({
            scene: aParams.scene,
            x: 0,
            y: 0,
            type: 'buttonRectangleDepthBorder',
            hoverType: 'buttonRectangleDepthFlat',
            icon: 'home',
            text: 'Menu',
            callback: () => {
                console.log('menu')
                this.scene.cameras.main.fadeOut(500, 0, 0, 0)
                this.scene.cameras.main.once(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    (
                        cam: Phaser.Cameras.Scene2D.Camera,
                        effect: Phaser.Cameras.Scene2D.Effects.Fade
                    ) => {
                        this.scene.scene.start('MenuScene')
                    }
                )
            },
            width: 250,
            height: 80,
        })
        Phaser.Display.Align.In.TopCenter(gameOverText, this.background, 0, -50)
        Phaser.Display.Align.In.Center(scoreLabel, this.background, 0, -150)
        Phaser.Display.Align.In.Center(this.scoreText, this.background, 0, -100)
        Phaser.Display.Align.In.Center(highScoreLabel, this.background, 0, 0)
        Phaser.Display.Align.In.Center(this.highScoreText, this.background, 0, 50)
        Phaser.Display.Align.In.BottomLeft(this.menuButton, this.background, -30, -50)
        Phaser.Display.Align.In.BottomRight(this.newGameButton, this.background, -30, -50)
        this.setSize(this.background.displayWidth, this.background.displayHeight)
        this.setScrollFactor(0)
        this.setInteractive()
        this.background.setDepth(10)
        this.add([
            this.background,
            gameOverText,
            scoreLabel,
            this.scoreText,
            highScoreLabel,
            this.highScoreText,
            this.newGameButton,
            this.menuButton,
        ])
        this.setDepth(10)
        this.scoreManager = ScoreManager.getInstance()
        this.highScoreText.setText(`${this.scoreManager.getHighScore()}`)
        this.scene.add.existing(this)
    }

    public displayScore(): void {
        const score = this.scoreManager.getScore()
        const highScore = this.scoreManager.getHighScore()
        console.log(score, highScore)
        let newHighScore = highScore
        if (score > highScore) {
            newHighScore = score
            this.scoreManager.setHighScore(newHighScore)
        }
        this.scene.tweens.addCounter({
            from: 0,
            to: score,
            duration: 1000,
            delay: 1000,
            onUpdate: (tween) => {
                this.scoreText.setText(`${Math.floor(tween.getValue())}`)
                // console.log(tween.getValue())
            },
            onComplete: () => {
                this.scoreManager.resetScore()
                this.scene.tweens.addCounter({
                    from: highScore,
                    to: newHighScore,
                    duration: 1000,
                    delay: 500,
                    onUpdate: (tween) => {
                        this.highScoreText.setText(`${Math.floor(tween.getValue())}`)
                        console.log(tween.getValue())
                    },
                })
            },
        })
    }
}

export default GameOverPopup
