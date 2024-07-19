import { DAMAGE, RELOAD_TIME } from '../constants'
import { IImageConstructor } from '../interfaces/image.interface'
import Bullet from './Bullet'

class Enemy extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body

    // variables
    private health: number
    private maxHealth: number
    private lastShoot: number
    private speed: number
    private explodeSound: Phaser.Sound.BaseSound

    // children
    private barrel: Phaser.GameObjects.Image
    private lifeBar: Phaser.GameObjects.Graphics
    private muzzleFlash: Phaser.GameObjects.Image

    // game objects
    private bullets: Phaser.GameObjects.Group
    private smokeEmitter: Phaser.GameObjects.Particles.ParticleEmitter

    public getBarrel(): Phaser.GameObjects.Image {
        return this.barrel
    }

    public getBullets(): Phaser.GameObjects.Group {
        return this.bullets
    }

    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

        this.initContainer()
        this.explodeSound = this.scene.sound.add('explosion')
        this.smokeEmitter = this.scene.add.particles(0, 0, 'smoke', {
            blendMode: 'MULTIPLY',
            scale: { start: 0.5, end: 1 },
            speed: { min: 20, max: 40 },
            quantity: 1,
            lifespan: 1000,
            gravityY: -50,
            follow: this,
            followOffset: { x: 0, y: -10 },
        })
        this.smokeEmitter.setDepth(5)
        this.smokeEmitter.stop()
        this.scene.add.existing(this)
    }

    private initContainer() {
        // variables
        this.health = 100
        this.maxHealth = 100
        this.lastShoot = 0
        this.speed = 100

        // image
        this.setDepth(0)

        this.muzzleFlash = this.scene.add.image(0, 0, 'muzzleFlash')
        this.muzzleFlash.setOrigin(0.5)
        this.muzzleFlash.setDepth(6)
        this.muzzleFlash.setAlpha(0)
        this.muzzleFlash.setScale(2)

        this.barrel = this.scene.add.image(0, 0, 'barrelRed')
        this.barrel.setOrigin(0.5, 1)
        this.barrel.setDepth(1)

        this.lifeBar = this.scene.add.graphics()
        this.redrawLifebar()

        // game objects
        this.bullets = this.scene.add.group({
            /*classType: Bullet,*/
            active: true,
            maxSize: 10,
            runChildUpdate: true,
        })

        // tweens
        this.scene.tweens.add({
            targets: this,
            props: { y: this.y - 200 },
            delay: 0,
            duration: 2000,
            ease: 'Linear',
            easeParams: null,
            hold: 0,
            repeat: -1,
            repeatDelay: 0,
            yoyo: true,
        })

        // physics
        this.scene.physics.world.enable(this)
    }

    update(): void {
        if (this.active) {
            this.barrel.x = this.x
            this.barrel.y = this.y
            this.lifeBar.x = this.x
            this.lifeBar.y = this.y
            this.handleShooting()
        } else {
            this.destroy()
            this.barrel.destroy()
            this.lifeBar.destroy()
        }
    }

    private handleShooting(): void {
        if (this.scene.time.now > this.lastShoot) {
            if (this.bullets.getLength() < 10) {
                this.bullets.add(
                    new Bullet({
                        scene: this.scene,
                        rotation: this.barrel.rotation,
                        x: this.barrel.x,
                        y: this.barrel.y,
                        texture: 'bulletRed',
                    })
                )
                this.muzzleFlash.x =
                    this.barrel.x + Math.cos(this.barrel.rotation - Math.PI / 2) * 70
                this.muzzleFlash.y =
                    this.barrel.y + Math.sin(this.barrel.rotation - Math.PI / 2) * 70
                this.muzzleFlash.rotation = this.barrel.rotation + Math.PI
                this.scene.tweens.add({
                    targets: this.muzzleFlash,
                    alpha: 1,
                    duration: 100,
                    ease: 'Power1',
                    yoyo: true,
                    repeat: 0,
                })

                this.lastShoot = this.scene.time.now + RELOAD_TIME
            }
        }
    }

    private redrawLifebar(): void {
        this.lifeBar.clear()
        this.lifeBar.fillStyle(0xe66a28, 1)
        this.lifeBar.fillRect(
            -this.width / 2,
            this.height / 2,
            (this.width * this.health) / this.maxHealth,
            15
        )
        this.lifeBar.lineStyle(2, 0xffffff)
        this.lifeBar.strokeRect(-this.width / 2, this.height / 2, this.width, 15)
        this.lifeBar.setDepth(1)
    }

    public updateHealth(damage = DAMAGE): void {
        if (this.health > 0) {
            this.health -= damage
            if (this.health < 0) {
                this.health = 0
            }
            this.redrawLifebar()
            if (this.health / this.maxHealth < 0.3) {
                this.smokeEmitter.start()
            }
        } else {
            this.health = 0
            this.active = false
            this.explodeSound.play()
            this.smokeEmitter.stop()
        }
    }
}

export default Enemy
