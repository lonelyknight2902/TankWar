import { IBulletConstructor } from '../interfaces/bullet.interface'

class Bullet extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body

    private bulletSpeed: number
    private bigHitSound: Phaser.Sound.BaseSound
    private mediumHitSound: Phaser.Sound.BaseSound
    private smallHitSound: Phaser.Sound.BaseSound

    constructor(aParams: IBulletConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture)

        this.rotation = aParams.rotation
        this.initImage()
        this.setScale(1.5)
        this.bigHitSound = this.scene.sound.add('bigHit')
        this.mediumHitSound = this.scene.sound.add('mediumHit')
        this.smallHitSound = this.scene.sound.add('smallHit')
        this.scene.add.existing(this)
    }

    private initImage(): void {
        // variables
        this.bulletSpeed = 1000

        // image
        this.setOrigin(0.5, 0.5)
        this.setDepth(2)

        // physics
        this.scene.physics.world.enable(this)
        this.scene.physics.velocityFromRotation(
            this.rotation - Math.PI / 2,
            this.bulletSpeed,
            this.body.velocity
        )
        this.anims.create({
            key: 'explode',
            frames: [
                { key: 'explosion1' },
                { key: 'explosion2' },
                { key: 'explosion3' },
                { key: 'explosion4' },
            ],
            frameRate: 15,
            repeat: 0,
        })
    }

    update(): void {
        return
    }

    public explode(
        onComplete: () => void = () => {
            return
        },
        hitType = 'none',
        refDistance = 10
    ): void {
        if (this.anims.isPlaying) {
            return
        }
        this.hit(hitType, refDistance)
        this.anims.play('explode', true).on('animationcomplete', () => {
            this.destroy()
            onComplete()
        })
    }

    public hit(type: string, refDistance = 10): void {
        switch (type) {
            case 'big':
                this.bigHitSound.play({
                    source: {
                        refDistance,
                    },
                })
                break
            case 'medium':
                this.mediumHitSound.play({
                    source: {
                        refDistance,
                    },
                })
                break
            case 'small':
                this.smallHitSound.play({
                    source: {
                        refDistance,
                    },
                })
                break
            default:
                break
        }
    }
}

export default Bullet
