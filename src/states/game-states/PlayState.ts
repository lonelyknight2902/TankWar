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
        this.scene.input.setDefaultCursor('url(assets/cursors/target_round_a.png) 16 16, pointer')
    }

    public execute(time: number, delta: number): void {
        console.log('Playing')
        const player = this.scene.getPlayer()
        player.update(time, delta)
        const gameUI = this.scene.getGameUI()
        gameUI.update(time, delta)

        this.scene
            .getEnemies()
            .getChildren()
            .forEach((enemy: any) => {
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

        if (
            this.scene
                .getEnemies()
                .getChildren()
                .every((enemy: any) => !enemy.active)
        ) {
            this.stateMachine.transition('gameover')
        }
    }

    public exit(): void {
        console.log('Game Over')
        this.scene.input.setDefaultCursor('url(assets/cursors/cursor_none.png), pointer')
    }
}

export default PlayState
