import { DAMAGE } from '../constants'
import ScoreManager from '../managers/ScoreManager'
import { Bullet, Enemy, Player } from '../objects'
import { Obstacle } from '../objects/obstacles/obstacle'
import { GameOverState, PauseState, PlayState } from '../states/game-states'
import StateMachine from '../states/StateMachine'
import { GameOverUI, GameUI, PauseUI } from '../user-interfaces'

class GameScene extends Phaser.Scene {
    private map: Phaser.Tilemaps.Tilemap
    private tileset: Phaser.Tilemaps.Tileset | null
    private layer: Phaser.Tilemaps.TilemapLayer | null

    private player: Player
    private enemies: Phaser.GameObjects.Group
    private obstacles: Phaser.GameObjects.Group
    private enemyHitPlayerOverlap: Phaser.Physics.Arcade.Collider
    private scoreManager: ScoreManager

    private target: Phaser.Math.Vector2
    private gameUI: GameUI
    private pauseUI: PauseUI
    private gameOverUI: GameOverUI
    private stateMachine: StateMachine
    private ambientSound: Phaser.Sound.BaseSound
    private warAmbientSound: Phaser.Sound.BaseSound
    private musics: Phaser.Sound.BaseSound[]
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
                this.player.getMGBullets(),
                this.layer,
                this.bulletHitLayer,
                undefined,
                this
            )

            this.physics.add.collider(
                this.player.getMGBullets(),
                this.obstacles,
                this.bulletHitObstacles,
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

                this.physics.add.overlap(
                    this.player.getMGBullets(),
                    enemy,
                    this.playerMGBulletHitEnemy,
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
            gameover: new GameOverState(this),
        })

        this.scoreManager = ScoreManager.getInstance()
        this.ambientSound = this.sound.add('ambient')
        this.warAmbientSound = this.sound.add('warAmbient')
        this.ambientSound.play({ loop: true, volume: 0.2 })
        this.warAmbientSound.play({ loop: true, volume: 0.2 })
        this.musics = [this.sound.add('music3'), this.sound.add('music4')]
        this.sound.stopAll()
        this.musics[1].play({ loop: true, volume: 0.8 })
        this.cameras.main.startFollow(this.player)
        this.gameUI = new GameUI({ x: 0, y: 0, scene: this })
        this.pauseUI = new PauseUI({ x: 0, y: 0, scene: this })
        this.pauseUI.setVisible(false)
        this.pauseUI.setActive(false)
        this.gameOverUI = new GameOverUI({ x: 0, y: 0, scene: this })
        this.pauseUI.setVisible(false)
        this.pauseUI.setActive(false)
        this.gameOverUI.setVisible(false)
        this.gameOverUI.setActive(false)
        this.cameras.main.fadeIn(1000, 0, 0, 0)
    }

    update(time: number, delta: number): void {
        this.stateMachine.update(time, delta)
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
        this.cameras.main.shake(100, 0.01)
        this.physics.world.remove(bullet.body)
        console.log('hit')
        bullet.explode(() => {
            player.updateHealth()
            if (!player.active) {
                this.stateMachine.transition('gameover')
            } else {
                const hitPointText = this.add.text(player.x, player.y, `-${DAMAGE}`, {
                    fontSize: '48px',
                    color: 'red',
                    fontStyle: 'bold',
                    fontFamily: 'Helvetica',
                    stroke: 'black',
                    strokeThickness: 10,
                })
                hitPointText.setOrigin(0.5)
                this.tweens.add({
                    targets: hitPointText,
                    y: hitPointText.y - 50,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        hitPointText.destroy()
                    },
                })
            }
        }, 'big')
    }

    private playerBulletHitEnemy(bullet: any, enemy: any): void {
        bullet.body.setVelocity(0)
        this.physics.world.remove(bullet.body)
        const distance = Phaser.Math.Distance.Between(bullet.x, bullet.y, enemy.x, enemy.y) / 1000
        bullet.explode(
            () => {
                enemy.updateHealth()
                if (!enemy.active) {
                    this.player.killEnemy()
                    this.scoreManager.increaseScore(100)
                    this.gameUI.showMedal()
                    const enemyKiledText = this.add.text(
                        this.player.x,
                        this.player.y,
                        'Enemy killed',
                        {
                            fontSize: '48px',
                            color: 'white',
                            fontStyle: 'bold',
                            fontFamily: 'Helvetica',
                        }
                    )
                    enemyKiledText.setOrigin(0.5)
                    this.tweens.add({
                        targets: enemyKiledText,
                        y: enemyKiledText.y - 50,
                        alpha: 0,
                        duration: 1000,
                        onComplete: () => {
                            enemyKiledText.destroy()
                        },
                    })
                } else {
                    const enemyHitText = this.add.text(this.player.x, this.player.y, 'Enemy Hit', {
                        fontSize: '24px',
                        color: 'white',
                        fontStyle: 'bold',
                        fontFamily: 'Helvetica',
                    })
                    this.scoreManager.increaseScore(10)
                    enemyHitText.setOrigin(0.5)
                    this.tweens.add({
                        targets: enemyHitText,
                        y: enemyHitText.y - 50,
                        alpha: 0,
                        duration: 1000,
                        onComplete: () => {
                            enemyHitText.destroy()
                        },
                    })
                }
                const hitPointText = this.add.text(enemy.x, enemy.y, `-${DAMAGE}`, {
                    fontSize: '48px',
                    color: 'red',
                    fontStyle: 'bold',
                    fontFamily: 'Helvetica',
                    stroke: 'black',
                    strokeThickness: 10,
                })
                hitPointText.setOrigin(0.5)
                this.tweens.add({
                    targets: hitPointText,
                    y: hitPointText.y - 50,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        hitPointText.destroy()
                    },
                })
            },
            'medium',
            distance
        )
    }

    private playerMGBulletHitEnemy(bullet: any, enemy: any): void {
        bullet.body.setVelocity(0)
        this.physics.world.remove(bullet.body)
        const distance = Phaser.Math.Distance.Between(bullet.x, bullet.y, enemy.x, enemy.y) / 1000
        bullet.explode(
            () => {
                enemy.updateHealth(1)
                if (!enemy.active) {
                    this.player.killEnemy()
                    this.scoreManager.increaseScore(100)
                    this.gameUI.showMedal()
                    const enemyKiledText = this.add.text(
                        this.player.x,
                        this.player.y,
                        'Enemy killed',
                        {
                            fontSize: '48px',
                            color: 'white',
                            fontStyle: 'bold',
                            fontFamily: 'Helvetica',
                        }
                    )
                    enemyKiledText.setOrigin(0.5)
                    this.tweens.add({
                        targets: enemyKiledText,
                        y: enemyKiledText.y - 50,
                        alpha: 0,
                        duration: 1000,
                        onComplete: () => {
                            enemyKiledText.destroy()
                        },
                    })
                } else {
                    const enemyHitText = this.add.text(this.player.x, this.player.y, 'Enemy Hit', {
                        fontSize: '24px',
                        color: 'white',
                        fontStyle: 'bold',
                        fontFamily: 'Helvetica',
                    })
                    this.scoreManager.increaseScore(1)
                    enemyHitText.setOrigin(0.5)
                    this.tweens.add({
                        targets: enemyHitText,
                        y: enemyHitText.y - 50,
                        alpha: 0,
                        duration: 1000,
                        onComplete: () => {
                            enemyHitText.destroy()
                        },
                    })
                }
                const hitPointText = this.add.text(enemy.x, enemy.y, `-${1}`, {
                    fontSize: '48px',
                    color: 'red',
                    fontStyle: 'bold',
                    fontFamily: 'Helvetica',
                    stroke: 'black',
                    strokeThickness: 10,
                })
                hitPointText.setOrigin(0.5)
                this.tweens.add({
                    targets: hitPointText,
                    y: hitPointText.y - 50,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        hitPointText.destroy()
                    },
                })
            },
            'small',
            distance
        )
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

    public getGameOverUI(): GameOverUI {
        return this.gameOverUI
    }

    public getStateMachine(): StateMachine {
        return this.stateMachine
    }
}

export default GameScene
