import { IBulletConstructor } from '../interfaces/bullet.interface'

class Bullet extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body

    private bulletSpeed: number

    constructor(aParams: IBulletConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture)

        this.rotation = aParams.rotation
        this.initImage()
        this.setScale(1.5)
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
        }
    ): void {
        if (this.anims.isPlaying) {
            return
        }
        this.anims.play('explode', true).on('animationcomplete', () => {
            this.destroy()
            onComplete()
        })
    }
}

export default Bullet
