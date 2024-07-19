import {
    DAMAGE,
    RELOAD_TIME,
    REPAIR_HEALTH,
    REPAIRING_SPEED,
    ROTATION_SPEED_DEGREES,
    SPEED,
    TOLERANCE,
} from '../constants'
import { IImageConstructor } from '../interfaces/image.interface'
import Bullet from './Bullet'
import MGBullet from './MGBullet'

class Player extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body

    // variables
    private health: number
    private maxHealth: number
    private lastShoot: number
    private lastMGShoot: number
    private speed: number

    // children
    private barrel: Phaser.GameObjects.Sprite
    private lifeBar: Phaser.GameObjects.Graphics

    // game objects
    private bullets: Phaser.GameObjects.Group
    private mgbullets: Phaser.GameObjects.Group
    private mgFireSound: Phaser.Sound.BaseSound
    private mgFireLastShotSound: Phaser.Sound.BaseSound
    private fireSound: Phaser.Sound.BaseSound
    private shellSound: Phaser.Sound.BaseSound
    private mgShellSound: Phaser.Sound.BaseSound
    private mgLastShellSound: Phaser.Sound.BaseSound
    private reloadSound: Phaser.Sound.BaseSound
    private turretTurn: Phaser.Sound.BaseSound

    // input
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private rotateKeyLeft: Phaser.Input.Keyboard.Key
    private rotateKeyRight: Phaser.Input.Keyboard.Key
    private forwardKey: Phaser.Input.Keyboard.Key
    private backwardKey: Phaser.Input.Keyboard.Key
    private shootingKey: Phaser.Input.Keyboard.Key
    private mgShootingKey: Phaser.Input.Keyboard.Key
    private repairKey: Phaser.Input.Keyboard.Key
    private engineSound0: Phaser.Sound.BaseSound
    private engineSound1: Phaser.Sound.BaseSound
    private engineSound2: Phaser.Sound.BaseSound
    private engineSound3: Phaser.Sound.BaseSound
    private trackSounds: Phaser.Sound.BaseSound[]
    private currentTrack: Phaser.Sound.BaseSound
    private damageSpeeches: Phaser.Sound.BaseSound[]
    private killSpeeches: Phaser.Sound.BaseSound[]
    private smokeEmitter: Phaser.GameObjects.Particles.ParticleEmitter
    private reloadingCircle: Phaser.GameObjects.Graphics
    private reloadingPercentage: number
    private repairCircle: Phaser.GameObjects.Graphics
    private repairPercentage: number
    private repairSound: Phaser.Sound.BaseSound
    private isRepaired: boolean
    private wrench: Phaser.GameObjects.Image
    private crosshair: Phaser.GameObjects.Image
    private muzzleFlash: Phaser.GameObjects.Image
    private mgMuzzleFlash: Phaser.GameObjects.Image

    public getBullets(): Phaser.GameObjects.Group {
        return this.bullets
    }

    public getMGBullets(): Phaser.GameObjects.Group {
        return this.mgbullets
    }

    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

        this.initImage()
        this.fireSound = this.scene.sound.add('cannonFire')
        this.mgFireSound = this.scene.sound.add('mgFire')
        this.shellSound = this.scene.sound.add('cannonShellDrop')
        this.reloadSound = this.scene.sound.add('cannonReload')
        this.mgShellSound = this.scene.sound.add('mgShellDrop')
        this.mgFireLastShotSound = this.scene.sound.add('mgFireLastShot')
        this.mgLastShellSound = this.scene.sound.add('mgLastShell')
        this.repairSound = this.scene.sound.add('repair', { volume: 0.5 })
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
        this.lastMGShoot = 0
        this.speed = SPEED

        // image
        this.setOrigin(0.5, 0.5)
        this.setDepth(0)
        this.angle = 180

        this.muzzleFlash = this.scene.add.image(this.x, this.y, 'muzzleFlash')
        this.muzzleFlash.setDepth(6)
        this.muzzleFlash.setAlpha(0)
        this.muzzleFlash.setOrigin(0.5)
        this.muzzleFlash.setScale(2)
        this.mgMuzzleFlash = this.scene.add.image(this.x, this.y, 'mgMuzzleFlash')
        this.mgMuzzleFlash.setDepth(6)
        this.mgMuzzleFlash.setAlpha(0)
        this.mgMuzzleFlash.setOrigin(0.5)
        this.barrel = this.scene.physics.add.sprite(this.x, this.y, 'barrelBlue')
        this.barrel.setOrigin(0.5, 1)
        this.barrel.setDepth(1)
        this.barrel.angle = 180

        this.setScale(2)
        this.barrel.setScale(2)

        this.lifeBar = this.scene.add.graphics()
        this.lifeBar.setDepth(6)
        this.redrawLifebar()

        this.reloadingCircle = this.scene.add.graphics()
        this.reloadingCircle.setDepth(6)
        this.reloadingCircle.name = 'reloadingCircle'
        this.reloadingPercentage = 100

        this.repairPercentage = 100
        this.repairCircle = this.scene.add.graphics()
        this.repairCircle.setDepth(6)
        this.repairCircle.name = 'repairCircle'
        this.isRepaired = true
        this.wrench = this.scene.add.image(this.x, this.y, 'wrench')
        this.wrench.setOrigin(0.5)
        this.wrench.setVisible(false)
        this.wrench.name = 'wrench'
        this.wrench.setDepth(6)

        this.crosshair = this.scene.add.image(0, 0, 'crosshair')
        this.crosshair.setOrigin(0.5)

        // game objects
        this.bullets = this.scene.add.group({
            /*classType: Bullet,*/
            active: true,
            maxSize: 10,
            runChildUpdate: true,
        })

        this.mgbullets = this.scene.add.group({
            /*classType: Bullet,*/
            active: true,
            maxSize: 20,
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
            this.repairKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
            this.mgShootingKey = this.scene.input.keyboard.addKey(
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

    update(time: number, delta: number): void {
        if (this.active) {
            this.barrel.x = this.x
            this.barrel.y = this.y
            this.lifeBar.x = this.x
            this.lifeBar.y = this.y
            this.handleInput()
            this.handleShooting()
            this.handleMGShooting()
            if (this.repairKey.isDown) {
                if (this.health < this.maxHealth) {
                    if (this.repairPercentage >= 100 && this.isRepaired) {
                        this.repairPercentage = 0
                        this.isRepaired = false
                    }
                }
                console.log(this.isRepaired)
                if (this.repairPercentage < 100) {
                    if (!this.repairSound.isPlaying) {
                        this.repairSound.play({ loop: true })
                    }
                    this.wrench.setVisible(true)
                    this.wrench.setPosition(this.x, this.y)
                    this.repairPercentage += (100 / REPAIRING_SPEED) * delta
                    this.repairCircle.clear()
                    this.repairCircle.lineStyle(10, 0xffffff)
                    this.repairCircle.beginPath()
                    this.repairCircle.arc(
                        this.x,
                        this.y,
                        20,
                        0,
                        Phaser.Math.DegToRad((this.repairPercentage * 3.6) % 360)
                    )
                    this.repairCircle.strokePath()
                } else {
                    this.repairCircle.clear()
                    this.repairSound.stop()
                    this.wrench.setVisible(false)
                    console.log('done: ', this.isRepaired)
                    if (!this.isRepaired) {
                        if (this.health < this.maxHealth) {
                            console.log(this.health)
                            this.health += REPAIR_HEALTH
                            console.log(this.health)
                            if (this.health > this.maxHealth) {
                                console.log(this.health, this.maxHealth)
                                this.health = this.maxHealth
                            }
                            this.redrawLifebar()
                        }
                        if (this.health > this.maxHealth * 0.3) {
                            this.smokeEmitter.stop()
                        }
                        this.isRepaired = true
                    }
                }
            } else {
                this.repairCircle.clear()
                this.repairSound.stop()
                this.wrench.setVisible(false)
            }
            if (this.reloadingPercentage < 100) {
                this.reloadingPercentage += (100 / RELOAD_TIME) * delta
                // console.log('reloading: ', this.reloadingPercentage)
                this.reloadingCircle.clear()
                this.reloadingCircle.lineStyle(10, 0xff0000)
                this.reloadingCircle.beginPath()
                this.reloadingCircle.arc(
                    this.x,
                    this.y - 50,
                    20,
                    0,
                    Phaser.Math.DegToRad((this.reloadingPercentage * 3.6) % 360)
                )
                this.reloadingCircle.strokePath()
            } else {
                this.reloadingCircle.clear()
            }
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
            this.crosshair.setPosition(pointer.worldX, pointer.worldY)
        } else {
            const body = this.barrel.body as Phaser.Physics.Arcade.Body
            body.setAngularVelocity(Math.sign(angleDelta) * ROTATION_SPEED_DEGREES)
            if (!this.turretTurn.isPlaying) {
                this.turretTurn.play({ loop: true })
            }
            const distance = Phaser.Math.Distance.Between(
                this.barrel.x,
                this.barrel.y,
                pointer.worldX,
                pointer.worldY
            )
            const crosshairX =
                this.barrel.x + Math.cos(this.barrel.rotation - Math.PI / 2) * distance
            const crosshairY =
                this.barrel.y + Math.sin(this.barrel.rotation - Math.PI / 2) * distance
            this.crosshair.setPosition(crosshairX, crosshairY)
            // this.barrel.rotation += Math.sign(angleDelta) * ROTATION_SPEED
        }
    }

    private handleShooting(): void {
        if (
            this.scene.input.activePointer.isDown &&
            this.scene.time.now > this.lastShoot &&
            !this.reloadSound.isPlaying
        ) {
            this.scene.cameras.main.shake(20, 0.005)
            this.fireSound.play()
            this.reloadingPercentage = 0
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

            this.muzzleFlash.setRotation(this.barrel.rotation + Math.PI)
            const muzzleFlashX = this.barrel.x + Math.cos(this.barrel.rotation - Math.PI / 2) * 70
            const muzzleFlashY = this.barrel.y + Math.sin(this.barrel.rotation - Math.PI / 2) * 70
            this.muzzleFlash.setPosition(muzzleFlashX, muzzleFlashY)

            this.scene.tweens.add({
                targets: this.muzzleFlash,
                props: { alpha: 1 },
                delay: 0,
                duration: 100,
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

                bullet.setScale(3)
                this.bullets.add(bullet)

                this.lastShoot = this.scene.time.now + RELOAD_TIME
            }
        }
    }

    private handleMGShooting(): void {
        if (this.mgShootingKey.isDown && this.scene.time.now > this.lastMGShoot) {
            // this.scene.cameras.main.shake(20, 0.005)
            if (!this.mgFireSound.isPlaying) this.mgFireSound.play({ loop: true })
            if (!this.mgShellSound.isPlaying)
                this.mgShellSound.play({ delay: 0.2, volume: 1, loop: true })
            // this.reloadingPercentage = 0
            // this.shellSound.play({ delay: 1, volume: 0.5 })
            // this.reloadSound.play({ delay: 1.5, volume: 0.5 })
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
            this.mgMuzzleFlash.setRotation(this.barrel.rotation + Math.PI)
            const muzzleFlashX = this.barrel.x + Math.cos(this.barrel.rotation - Math.PI / 2) * 70
            const muzzleFlashY = this.barrel.y + Math.sin(this.barrel.rotation - Math.PI / 2) * 70
            this.mgMuzzleFlash.setPosition(muzzleFlashX, muzzleFlashY)

            this.scene.tweens.add({
                targets: this.mgMuzzleFlash,
                props: { alpha: 1 },
                delay: 0,
                duration: 70,
                ease: 'Power1',
                easeParams: null,
                hold: 0,
                repeat: 0,
                repeatDelay: 0,
                yoyo: true,
                paused: false,
            })

            if (this.mgbullets.getLength() < 20) {
                const bullet = new MGBullet({
                    scene: this.scene,
                    rotation: this.barrel.rotation,
                    x: this.barrel.x,
                    y: this.barrel.y,
                    texture: 'bulletBlue',
                })

                bullet.setScale(1)
                this.mgbullets.add(bullet)

                this.lastMGShoot = this.scene.time.now + 100
            }
        } else if (this.scene.time.now > this.lastMGShoot) {
            if (this.mgFireSound.isPlaying) {
                this.mgFireSound.stop()
                this.mgFireLastShotSound.play()
            }
            if (this.mgShellSound.isPlaying) {
                this.mgShellSound.stop()
                this.mgLastShellSound.play()
            }

            this.mgMuzzleFlash.setAlpha(0)
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
            } else {
                this.smokeEmitter.stop()
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
