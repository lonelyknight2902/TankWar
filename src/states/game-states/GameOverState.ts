import { GameScene } from '../../scenes'
import State from '../State'

class GameOverState extends State {
    private scene: GameScene
    private explodeSound: Phaser.Sound.BaseSound
    constructor(scene: GameScene) {
        super()
        this.scene = scene
        this.explodeSound = this.scene.sound.add('playerExplosion')
    }

    public enter(): void {
        console.log('Game Over')
        this.scene.physics.pause()
        // this.scene.tweens.pauseAll()
        const activeTween = this.scene.tweens.getTweens()
        activeTween.forEach((tween: Phaser.Tweens.Tween) => {
            tween.pause()
        })
        this.scene.sound.pauseAll()
        this.explodeSound.play()
        const gameOverUI = this.scene.getGameOverUI()
        gameOverUI.setVisible(true)
        gameOverUI.setActive(true)
        gameOverUI.display()
    }

    public execute(time: number, delta: number): void {
        console.log('Game Over')
    }

    public exit(): void {
        console.log('Game Over')
        this.scene.physics.resume()
        this.scene.tweens.resumeAll()
        this.scene.sound.resumeAll()
        const gameOverUI = this.scene.getGameOverUI()
        gameOverUI.setVisible(false)
        gameOverUI.setActive(false)
    }
}

export default GameOverState
