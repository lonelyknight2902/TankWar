import { ROTATION_SPEED_DEGREES, SPEED, TOLERANCE } from '../constants'
import { IImageConstructor } from '../interfaces/image.interface'
import Bullet from './Bullet'

class Player extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body

    // variables
    private health: number
    private lastShoot: number
    private speed: number

    // children
    private barrel: Phaser.GameObjects.Sprite
    private lifeBar: Phaser.GameObjects.Graphics

    // game objects
    private bullets: Phaser.GameObjects.Group

    // input
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private rotateKeyLeft: Phaser.Input.Keyboard.Key
    private rotateKeyRight: Phaser.Input.Keyboard.Key
    private forwardKey: Phaser.Input.Keyboard.Key
    private backwardKey: Phaser.Input.Keyboard.Key
    private shootingKey: Phaser.Input.Keyboard.Key

    public getBullets(): Phaser.GameObjects.Group {
        return this.bullets
    }

    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

        this.initImage()
        this.scene.add.existing(this)
    }

    private initImage() {
        // variables
        this.health = 1
        this.lastShoot = 0
        this.speed = SPEED

        // image
        this.setOrigin(0.5, 0.5)
        this.setDepth(0)
        this.angle = 180

        this.barrel = this.scene.physics.add.sprite(this.x, this.y, 'barrelBlue')
        this.barrel.setOrigin(0.5, 1)
        this.barrel.setDepth(1)
        this.barrel.angle = 180

        this.setScale(1.5)
        this.barrel.setScale(1.5)

        this.lifeBar = this.scene.add.graphics()
        this.redrawLifebar()

        // game objects
        this.bullets = this.scene.add.group({
            /*classType: Bullet,*/
            active: true,
            maxSize: 10,
            runChildUpdate: true,
        })

        // input
        if (this.scene.input.keyboard) {
            this.cursors = this.scene.input.keyboard.createCursorKeys()
            this.rotateKeyLeft = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
            this.rotateKeyRight = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
            this.forwardKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
            this.backwardKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
            this.shootingKey = this.scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.SPACE
            )
        }

        // physics
        this.scene.physics.world.enable(this)
        const body = this.body as Phaser.Physics.Arcade.Body
        body.setDamping(true)
        // body.setDrag(1)
        body.setMaxSpeed(this.speed)
    }

    update(): void {
        if (this.active) {
            this.barrel.x = this.x
            this.barrel.y = this.y
            this.lifeBar.x = this.x
            this.lifeBar.y = this.y
            this.handleInput()
            this.handleShooting()
        } else {
            this.destroy()
            this.barrel.destroy()
            this.lifeBar.destroy()
        }
    }

    private handleInput() {
        // move tank forward
        // small corrections with (- MATH.PI / 2) to align tank correctly
        this.body.setAcceleration(0)
        this.body.setDrag(0)
        this.body.angularVelocity = 0

        // rotate tank
        if (this.rotateKeyLeft.isDown) {
            // this.rotation -= 0.02
            this.body.angularVelocity = -ROTATION_SPEED_DEGREES
        } else if (this.rotateKeyRight.isDown) {
            // this.rotation += 0.02
            this.body.angularVelocity = ROTATION_SPEED_DEGREES
        }

        if (this.forwardKey.isDown) {
            // this.scene.physics.velocityFromRotation(
            //     this.rotation - Math.PI / 2,
            //     this.speed,
            //     this.body.acceleration
            // )
            this.body.acceleration.setToPolar(this.rotation - Math.PI / 2, this.speed)
        } else if (this.backwardKey.isDown) {
            // this.scene.physics.velocityFromRotation(
            //     this.rotation - Math.PI / 2,
            //     -this.speed,
            //     this.body.acceleration
            // )
            // this.body.acceleration.setToPolar(this.rotation - Math.PI / 2, this.speed)
            this.body.setDrag(0.2)
        } else {
            this.body.setDrag(0.3)
            // this.body.setVelocity(0, 0)
            // this.body.setAcceleration(0, 0)
        }

        this.scene.physics.velocityFromRotation(
            this.rotation - Math.PI / 2,
            this.body.speed,
            this.body.velocity
        )

        if (!this.forwardKey.isDown && !this.backwardKey.isDown && this.body.speed < 3) {
            this.body.setVelocity(0)
        }

        // rotate barrel
        // if (this.rotateKeyLeft.isDown) {
        //     this.barrel.rotation -= 0.05
        // } else if (this.rotateKeyRight.isDown) {
        //     this.barrel.rotation += 0.05
        // }
        this.pointerMove(this.scene.input.activePointer)
        this.scene.physics.velocityFromRotation(
            this.barrel.rotation,
            0,
            (this.barrel.body as Phaser.Physics.Arcade.Body).velocity
        )
    }

    private pointerMove(pointer: Phaser.Input.Pointer): void {
        const angleToPointer =
            Phaser.Math.Angle.Between(
                this.barrel.x,
                this.barrel.y,
                pointer.worldX,
                pointer.worldY
            ) +
            Math.PI / 2
        console.log(pointer.x, pointer.y)
        // this.barrel.rotation = angleToPointer
        const angleDelta = Phaser.Math.Angle.Wrap(angleToPointer - this.barrel.rotation)
        // console.log(
        //     'Angle: ',
        //     (angleToPointer * 180) / Math.PI,
        //     this.barrel.x,
        //     this.barrel.y,
        //     pointer.worldX,
        //     pointer.worldY
        // )
        if (Phaser.Math.Fuzzy.Equal(angleDelta, 0, TOLERANCE)) {
            this.barrel.rotation = angleToPointer
            const body = this.barrel.body as Phaser.Physics.Arcade.Body
            body.setAngularVelocity(0)
        } else {
            const body = this.barrel.body as Phaser.Physics.Arcade.Body
            body.setAngularVelocity(Math.sign(angleDelta) * ROTATION_SPEED_DEGREES)
            // this.barrel.rotation += Math.sign(angleDelta) * ROTATION_SPEED
        }
    }

    private handleShooting(): void {
        if (this.scene.input.activePointer.isDown && this.scene.time.now > this.lastShoot) {
            // this.scene.cameras.main.shake(20, 0.005)
            this.scene.tweens.add({
                targets: this,
                props: { alpha: 0.8 },
                delay: 0,
                duration: 5,
                ease: 'Power1',
                easeParams: null,
                hold: 0,
                repeat: 0,
                repeatDelay: 0,
                yoyo: true,
                paused: false,
            })

            if (this.bullets.getLength() < 10) {
                this.bullets.add(
                    new Bullet({
                        scene: this.scene,
                        rotation: this.barrel.rotation,
                        x: this.barrel.x,
                        y: this.barrel.y,
                        texture: 'bulletBlue',
                    })
                )

                this.lastShoot = this.scene.time.now + 80
            }
        }
    }

    private redrawLifebar(): void {
        this.lifeBar.clear()
        this.lifeBar.fillStyle(0xe66a28, 1)
        this.lifeBar.fillRect(-this.width / 2, this.height / 2, this.width * this.health, 15)
        this.lifeBar.lineStyle(2, 0xffffff)
        this.lifeBar.strokeRect(-this.width / 2, this.height / 2, this.width, 15)
        this.lifeBar.setDepth(1)
    }

    public updateHealth(): void {
        if (this.health > 0) {
            this.health -= 0.05
            this.redrawLifebar()
        } else {
            this.health = 0
            this.active = false
            this.scene.scene.start('MenuScene')
        }
    }
}

export default Player
