import { GameScene } from '../../scenes'
import State from '../State'

class PlayState extends State {
    private scene: GameScene
    constructor(scene: GameScene) {
        super()
        this.scene = scene
    }

    public enter(): void {
        console.log('Playing')
    }

    public execute(time: number, delta: number): void {
        console.log('Playing')
        const player = this.scene.getPlayer()
        player.update()

        this.scene.getEnemies().getChildren().forEach((enemy: any) => {
            enemy.update()
            if (player.active && enemy.active) {
                const angle = Phaser.Math.Angle.Between(
                    enemy.body.x,
                    enemy.body.y,
                    player.body.x,
                    player.body.y
                )

                enemy.getBarrel().angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG
            }
        }, this)
    }

    public exit(): void {
        console.log('Game Over')
    }
}

export default PlayState
