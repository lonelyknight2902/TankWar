import { Bullet, Enemy, Player } from '../objects'
import { Obstacle } from '../objects/obstacles/obstacle'
import { PauseState, PlayState } from '../states/game-states'
import StateMachine from '../states/StateMachine'
import { GameUI, PauseUI } from '../user-interfaces'

class GameScene extends Phaser.Scene {
    private map: Phaser.Tilemaps.Tilemap
    private tileset: Phaser.Tilemaps.Tileset | null
    private layer: Phaser.Tilemaps.TilemapLayer | null

    private player: Player
    private enemies: Phaser.GameObjects.Group
    private obstacles: Phaser.GameObjects.Group
    private enemyHitPlayerOverlap: Phaser.Physics.Arcade.Collider

    private target: Phaser.Math.Vector2
    private gameUI: GameUI
    private pauseUI: PauseUI
    private stateMachine: StateMachine
    constructor() {
        super({
            key: 'GameScene',
        })
    }

    init(): void {
        return
    }

    create(): void {
        // create tilemap from tiled JSON
        this.map = this.make.tilemap({ key: 'levelMap' })

        this.tileset = this.map.addTilesetImage('tiles')
        if (this.tileset) {
            this.layer = this.map.createLayer('tileLayer', this.tileset, 0, 0)
            this.layer?.setCollisionByProperty({ collide: true })
        }

        this.obstacles = this.add.group({
            /*classType: Obstacle,*/
            runChildUpdate: true,
        })

        this.enemies = this.add.group({
            /*classType: Enemy*/
        })
        this.convertObjects()

        if (this.layer) {
            // collider layer and obstacles
            this.physics.add.collider(this.player, this.layer)
            this.physics.add.collider(this.player, this.obstacles)

            // collider for bullets
            this.physics.add.collider(
                this.player.getBullets(),
                this.layer,
                this.bulletHitLayer,
                undefined,
                this
            )

            this.physics.add.collider(
                this.player.getBullets(),
                this.obstacles,
                this.bulletHitObstacles,
                undefined,
                this
            )

            this.enemies.getChildren().forEach((enemy: any) => {
                this.physics.add.overlap(
                    this.player.getBullets(),
                    enemy,
                    this.playerBulletHitEnemy,
                    undefined,
                    this
                )
                this.enemyHitPlayerOverlap = this.physics.add.overlap(
                    enemy.getBullets(),
                    this.player,
                    this.enemyBulletHitPlayer,
                    undefined,
                    this
                )

                this.physics.add.collider(
                    enemy.getBullets(),
                    this.obstacles,
                    this.bulletHitObstacles,
                    undefined
                )
                this.physics.add.collider(
                    enemy.getBullets(),
                    this.layer as Phaser.Tilemaps.TilemapLayer,
                    this.bulletHitLayer,
                    undefined
                )
            }, this)
        }

        this.stateMachine = new StateMachine('play', {
            play: new PlayState(this),
            pause: new PauseState(this),
        })

        this.cameras.main.startFollow(this.player)
        this.gameUI = new GameUI({ x: 0, y: 0, scene: this })
        this.pauseUI = new PauseUI({ x: 0, y: 0, scene: this })
        this.pauseUI.setVisible(false)
        this.pauseUI.setActive(false)
    }

    update(): void {
        this.player.update()

        this.enemies.getChildren().forEach((enemy: any) => {
            enemy.update()
            if (this.player.active && enemy.active) {
                const angle = Phaser.Math.Angle.Between(
                    enemy.body.x,
                    enemy.body.y,
                    this.player.body.x,
                    this.player.body.y
                )

                enemy.getBarrel().angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG
            }
        }, this)
    }

    private convertObjects(): void {
        // find the object layer in the tilemap named 'objects'
        const objects = this.map.getObjectLayer('objects')?.objects as any[]

        objects.forEach((object) => {
            if (object.type === 'player') {
                this.player = new Player({
                    scene: this,
                    x: object.x,
                    y: object.y,
                    texture: 'tankBlue',
                })
            } else if (object.type === 'enemy') {
                const enemy = new Enemy({
                    scene: this,
                    x: object.x,
                    y: object.y,
                    texture: 'tankRed',
                })

                this.enemies.add(enemy)
            } else {
                const obstacle = new Obstacle({
                    scene: this,
                    x: object.x,
                    y: object.y - 40,
                    texture: object.type,
                })

                this.obstacles.add(obstacle)
            }
        })
    }

    private bulletHitLayer(bullet: any): void {
        bullet.body.setVelocity(0)
        bullet.explode()
        // bullet.destroy()
    }

    private bulletHitObstacles(bullet: any, obstacle: any): void {
        bullet.body.setVelocity(0)
        bullet.explode()
    }

    private enemyBulletHitPlayer(bullet: any, player: any): void {
        bullet.body.setVelocity(0)
        this.physics.world.remove(bullet.body)
        console.log('hit')
        bullet.explode(() => {
            player.updateHealth()
        })
    }

    private playerBulletHitEnemy(bullet: any, enemy: any): void {
        bullet.body.setVelocity(0)
        this.physics.world.remove(bullet.body)
        bullet.explode(() => {
            enemy.updateHealth()
        })
    }

    public getPlayer(): Player {
        return this.player
    }

    public getEnemies(): Phaser.GameObjects.Group {
        return this.enemies
    }

    public getGameUI(): GameUI {
        return this.gameUI
    }

    public getPauseUI(): PauseUI {
        return this.pauseUI
    }

    public getStateMachine(): StateMachine {
        return this.stateMachine
    }
}

export default GameScene
