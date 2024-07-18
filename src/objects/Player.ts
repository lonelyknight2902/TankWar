import { DAMAGE, RELOAD_TIME, ROTATION_SPEED_DEGREES, SPEED, TOLERANCE } from '../constants'
import { IImageConstructor } from '../interfaces/image.interface'
import Bullet from './Bullet'

class Player extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body

    // variables
    private health: number
    private maxHealth: number
    private lastShoot: number
    private speed: number

    // children
    private barrel: Phaser.GameObjects.Sprite
    private lifeBar: Phaser.GameObjects.Graphics

    // game objects
    private bullets: Phaser.GameObjects.Group
    private fireSound: Phaser.Sound.BaseSound
    private shellSound: Phaser.Sound.BaseSound
    private reloadSound: Phaser.Sound.BaseSound
    private turretTurn: Phaser.Sound.BaseSound

    // input
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private rotateKeyLeft: Phaser.Input.Keyboard.Key
    private rotateKeyRight: Phaser.Input.Keyboard.Key
    private forwardKey: Phaser.Input.Keyboard.Key
    private backwardKey: Phaser.Input.Keyboard.Key
    private shootingKey: Phaser.Input.Keyboard.Key
    private engineSound0: Phaser.Sound.BaseSound
    private engineSound1: Phaser.Sound.BaseSound
    private engineSound2: Phaser.Sound.BaseSound
    private engineSound3: Phaser.Sound.BaseSound
    private trackSounds: Phaser.Sound.BaseSound[]
    private currentTrack: Phaser.Sound.BaseSound
    private damageSpeeches: Phaser.Sound.BaseSound[]
    private killSpeeches: Phaser.Sound.BaseSound[]
    private smokeEmitter: Phaser.GameObjects.Particles.ParticleEmitter

    public getBullets(): Phaser.GameObjects.Group {
        return this.bullets
    }

    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

        this.initImage()
        this.fireSound = this.scene.sound.add('cannonFire')
        this.shellSound = this.scene.sound.add('cannonShellDrop')
        this.reloadSound = this.scene.sound.add('cannonReload')
        this.turretTurn = this.scene.sound.add('turretTurn', { volume: 0.3 })
        this.engineSound0 = this.scene.sound.add('engine0', { volume: 0.5 })
        this.engineSound1 = this.scene.sound.add('engine1', { volume: 0.5 })
        this.engineSound2 = this.scene.sound.add('engine2', { volume: 0.5 })
        this.engineSound3 = this.scene.sound.add('engine3', { volume: 0.5 })
        this.damageSpeeches = [
            this.scene.sound.add('damage1', { volume: 3 }),
            this.scene.sound.add('damage2', { volume: 3 }),
            this.scene.sound.add('damage3', { volume: 3 }),
            this.scene.sound.add('damage4', { volume: 3 }),
        ]
        this.killSpeeches = [
            this.scene.sound.add('kill1', { volume: 3 }),
            this.scene.sound.add('kill2', { volume: 3 }),
            this.scene.sound.add('kill3', { volume: 3 }),
            this.scene.sound.add('kill4', { volume: 3 }),
        ]
        this.trackSounds = [
            this.scene.sound.add('track1', { volume: 0.3 }),
            this.scene.sound.add('track2', { volume: 0.3 }),
            this.scene.sound.add('track3', { volume: 0.3 }),
        ]
        this.currentTrack = this.trackSounds[0]
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

    private initImage() {
        // variables
        this.health = 100
        this.maxHealth = 100
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

        this.setScale(2)
        this.barrel.setScale(2)

        this.lifeBar = this.scene.add.graphics()
        this.lifeBar.setDepth(6)
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
        this.state = 'idle'
    }

    update(): void {
        if (this.active) {
            this.barrel.x = this.x
            this.barrel.y = this.y
            this.lifeBar.x = this.x
            this.lifeBar.y = this.y
            this.handleInput()
            this.handleShooting()
            if (this.body.speed == 0) {
                if (!this.engineSound0.isPlaying) this.engineSound0.play()
                if (this.engineSound1.isPlaying) this.engineSound1.stop()
                if (this.engineSound2.isPlaying) this.engineSound2.stop()
                if (this.engineSound3.isPlaying) this.engineSound3.stop()
                this.currentTrack.stop()
            } else if (this.body.speed < SPEED / 3) {
                if (this.engineSound0.isPlaying) this.engineSound0.stop()
                if (!this.engineSound1.isPlaying) this.engineSound1.play()
                if (this.engineSound2.isPlaying) this.engineSound2.stop()
                if (this.engineSound3.isPlaying) this.engineSound3.stop()
                if (this.currentTrack != this.trackSounds[0]) this.currentTrack.stop()
                this.currentTrack = this.trackSounds[0]
                if (!this.currentTrack.isPlaying) {
                    this.currentTrack.play({ loop: true })
                }
            } else if (this.body.speed < (SPEED * 2) / 3) {
                if (this.engineSound0.isPlaying) this.engineSound0.stop()
                if (this.engineSound1.isPlaying) this.engineSound1.stop()
                if (!this.engineSound2.isPlaying) this.engineSound2.play()
                if (this.engineSound3.isPlaying) this.engineSound3.stop()
                if (this.currentTrack != this.trackSounds[1]) this.currentTrack.stop()
                this.currentTrack = this.trackSounds[1]
                if (!this.currentTrack.isPlaying) {
                    this.currentTrack.play({ loop: true })
                }
            } else {
                if (this.engineSound0.isPlaying) this.engineSound0.stop()
                if (this.engineSound1.isPlaying) this.engineSound1.stop()
                if (this.engineSound2.isPlaying) this.engineSound2.stop()
                if (!this.engineSound3.isPlaying) this.engineSound3.play()
                if (this.currentTrack != this.trackSounds[2]) this.currentTrack.stop()
                this.currentTrack = this.trackSounds[2]
                if (!this.currentTrack.isPlaying) {
                    this.currentTrack.play({ loop: true })
                }
            }
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
        if (
            (this.rotateKeyLeft.isDown && this.state != 'backward') ||
            (this.rotateKeyRight.isDown && this.state == 'backward')
        ) {
            // this.rotation -= 0.02
            this.body.angularVelocity = -ROTATION_SPEED_DEGREES
        } else if (
            (this.rotateKeyRight.isDown && this.state != 'backward') ||
            (this.rotateKeyLeft.isDown && this.state == 'backward')
        ) {
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
            // console.log(((this.rotation - Math.PI / 2) * 180) / Math.PI)
            // console.log(this.body.acceleration)
            // console.log('Speed: ', this.body.velocity)
            if (this.body.speed < 3) {
                this.state = 'forward'
            }
            if (this.state === 'forward') {
                this.scene.physics.velocityFromRotation(
                    this.rotation - Math.PI / 2,
                    this.body.speed,
                    this.body.velocity
                )
            } else {
                this.body.setDrag(0.2)
                this.scene.physics.velocityFromRotation(
                    this.rotation + Math.PI / 2,
                    this.body.speed,
                    this.body.velocity
                )
            }
        } else if (this.backwardKey.isDown) {
            this.body.acceleration.setToPolar(this.rotation + Math.PI / 2, this.speed)
            // console.log(((this.rotation + Math.PI / 2) * 180) / Math.PI)
            // console.log(this.body.acceleration)
            // console.log('Speed: ', this.body.velocity)
            if (this.body.speed < 3) {
                this.state = 'backward'
            }
            if (this.state === 'backward') {
                this.scene.physics.velocityFromRotation(
                    this.rotation + Math.PI / 2,
                    this.body.speed,
                    this.body.velocity
                )
            } else {
                this.body.setDrag(0.2)
                this.scene.physics.velocityFromRotation(
                    this.rotation - Math.PI / 2,
                    this.body.speed,
                    this.body.velocity
                )
            }
        } else {
            this.body.setDrag(0.3)
            // this.body.setVelocity(0, 0)
            // this.body.setAcceleration(0, 0)
        }

        // this.scene.physics.velocityFromRotation(
        //     this.rotation - Math.PI / 2,
        //     this.body.speed,
        //     this.body.velocity
        // )

        if (!this.forwardKey.isDown && !this.backwardKey.isDown && this.body.speed < 3) {
            this.body.setVelocity(0)
            this.state = 'idle'
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
        // console.log(pointer.x, pointer.y)
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
            this.turretTurn.stop()
        } else {
            const body = this.barrel.body as Phaser.Physics.Arcade.Body
            body.setAngularVelocity(Math.sign(angleDelta) * ROTATION_SPEED_DEGREES)
            if (!this.turretTurn.isPlaying) {
                this.turretTurn.play({ loop: true })
            }
            // this.barrel.rotation += Math.sign(angleDelta) * ROTATION_SPEED
        }
    }

    private handleShooting(): void {
        if (this.scene.input.activePointer.isDown && this.scene.time.now > this.lastShoot && !this.reloadSound.isPlaying) {
            this.scene.cameras.main.shake(20, 0.005)
            this.fireSound.play()
            this.shellSound.play({ delay: 1, volume: 0.5 })
            this.reloadSound.play({ delay: 1.5, volume: 0.5 })
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
                const bullet = new Bullet({
                    scene: this.scene,
                    rotation: this.barrel.rotation,
                    x: this.barrel.x,
                    y: this.barrel.y,
                    texture: 'bulletBlue',
                })

                bullet.setScale(2)
                this.bullets.add(bullet)

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

    public updateHealth(): void {
        this.damageSpeeches[Phaser.Math.RND.between(0, 3)].play()
        if (this.health > 0) {
            this.health -= DAMAGE
            this.redrawLifebar()
            if (this.health / this.maxHealth < 0.3) {
                this.smokeEmitter.start()
            }
        } else {
            this.health = 0
            this.active = false
            // this.scene.scene.start('MenuScene')
        }
    }

    public killEnemy(): void {
        this.killSpeeches[Phaser.Math.RND.between(0, 3)].play()
    }
}

export default Player
