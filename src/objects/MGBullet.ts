import { IBulletConstructor } from '../interfaces/bullet.interface'

class MGBullet extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body

    private bulletSpeed: number
    private hitSound: Phaser.Sound.BaseSound

    constructor(aParams: IBulletConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture)

        this.rotation = aParams.rotation
        this.initImage()
        this.setScale(0.5)
        this.hitSound = this.scene.sound.add('smallHit')
        this.scene.add.existing(this)
    }

    private initImage(): void {
        // variables
        this.bulletSpeed = 2000

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
        hitType = '',
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
        if (type) {
            this.hitSound.play({
                source: {
                    refDistance,
                },
                volume: 0.5
            })
        }
    }
}

export default MGBullet
