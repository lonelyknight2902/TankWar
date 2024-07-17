import { GameScene } from '../../scenes'
import State from '../State'

class PauseState extends State {
    private scene: GameScene
    constructor(scene: GameScene) {
        super()
        this.scene = scene
    }
    public enter(): void {
        console.log('Paused')
        this.scene.physics.pause()
        // this.scene.sys.pause()
        this.scene.tweens.pauseAll()
        this.scene.sound.pauseAll()
        const pauseUI = this.scene.getPauseUI()
        pauseUI.setVisible(true)
        pauseUI.setActive(true)
    }

    public execute(time: number, delta: number): void {
        console.log('Paused')
    }

    public exit(): void {
        console.log('Unpaused')
        this.scene.physics.resume()
        this.scene.tweens.resumeAll()
        this.scene.sound.resumeAll()
        const pauseUI = this.scene.getPauseUI()
        pauseUI.setVisible(false)
        pauseUI.setActive(false)
    }
}

export default PauseState
