import {
    _decorator,
    CCBoolean,
    CircleCollider2D,
    Collider2D,
    Component,
    Contact2DType,
    IPhysics2DContact,
    RigidBody2D,
    Sprite,
    UITransform,
    Vec2,
    Vec3,
    resources,
    SpriteFrame,
    ImageAsset,
    CCFloat,
    ParticleSystem2D,
    tween,
} from 'cc'
import { EggPod } from '../Pods/EggPod'
import { EggBean } from '../Bean/EggBean'
import { AssetManagerManual } from '../Managers/AssetManagerManual'
import { GameplayPod } from '../Pods/GameplayPod'
const { ccclass, property } = _decorator

@ccclass('EggView')
export class EggView extends Component {
    @property
    public rb: RigidBody2D
    @property({ type: CCFloat })
    yOffset: number
    @property({ type: CCBoolean })
    isOnGrid: boolean
    @property({ type: CCBoolean })
    isFalling: boolean
    @property({ type: CCBoolean })
    isBullet: boolean

    @property({ type: EggPod })
    public eggPod: EggPod

    @property
    private eggSprite: Sprite
    @property
    private collider: CircleCollider2D

    @property({ type: ParticleSystem2D })
    private particleBomb1: ParticleSystem2D
    @property({ type: ParticleSystem2D })
    private particleBomb2: ParticleSystem2D

    private speedMove: number
    private isCollided: boolean = false
    private targetPosition: Vec3
    private isDestorying: boolean = false

    private gameplayPod: GameplayPod

    uiTransform: UITransform

    public doInit(bean: EggBean, isGrid: boolean) {
        this.gameplayPod = GameplayPod.instance

        this.uiTransform = this.getComponent(UITransform)
        this.isOnGrid = isGrid
        this.isBullet = !isGrid
        this.eggPod = new EggPod()
        this.eggPod.eggList.push(this)
        this.eggPod.eggListInType.push(this)

        this.eggPod.eventTarget.on('BeanChange', (bean: EggBean) => {
            this.eggSprite.getComponent(Sprite).spriteFrame = AssetManagerManual.instance.getAsset(bean.keySprite)
        })

        this.speedMove = this.gameplayPod.gameSpeed
        this.gameplayPod.gameplayPodEventTarget.on('gameSpeed', (speed: number) => {
            this.speedMove = speed
        })

        this.eggPod.ChangeBean(bean)

        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
    }

    private OnEggCollision(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (!this.isOnGrid) {
            this.targetPosition = this.getGridPosition(selfCollider, otherCollider)
            this.isCollided = true
        }

        this.rb.linearVelocity = new Vec2(0, 0)
        this.isOnGrid = true

        if (this.eggPod.eggListInType.length > 2) {
            this.eggPod.eggListInType.forEach((x) => {
                const eggView = x.getComponent(EggView)
                eggView.onBeforeDestory()
            })
        }
    }

    private getGridPosition(selfCollider: Collider2D, otherCollider: Collider2D): Vec3 {
        var vec: Vec3 = new Vec3()

        if (
            selfCollider.node.position.y <=
            otherCollider.node.position.y - otherCollider.getComponent(UITransform).height / 2
        ) {
            if (selfCollider.node.position.x < otherCollider.node.position.x)
                vec = new Vec3(
                    otherCollider.node.position.x - this.uiTransform.width / 2,
                    otherCollider.node.position.y - this.yOffset
                )
            else
                vec = new Vec3(
                    otherCollider.node.position.x + this.uiTransform.width / 2,
                    otherCollider.node.position.y - this.yOffset
                )
        } else {
            if (selfCollider.node.position.x < otherCollider.node.position.x)
                vec = new Vec3(otherCollider.node.position.x - this.uiTransform.width, otherCollider.node.position.y)
            else vec = new Vec3(otherCollider.node.position.x + this.uiTransform.width, otherCollider.node.position.y)
        }

        return vec
    }

    update(deltaTime: number) {
        if (!this.isDestorying) {
            if (this.isCollided) {
                this.node.setPosition(this.targetPosition)
                this.isCollided = false
            }

            this.collider.sensor = this.isOnGrid

            if (this.isOnGrid) {
                var yPosition = this.node.position.y - this.speedMove * deltaTime
                this.node.setPosition(this.node.position.x, yPosition, 0)

                return
            }
        }
    }

    public onBeforeDestory() {
        this.particleBomb1.resetSystem()
        this.particleBomb2.resetSystem()

        this.isDestorying = true
        this.collider.enabled = false
        this.rb.linearVelocity = new Vec2(0, 5)
        this.collider.sensor = true
        this.rb.gravityScale = 1

        this.scheduleOnce(() => {
            this.rb.linearVelocity = new Vec2(0, -15)
        }, 0.3)

        this.scheduleOnce(() => {
            this.node.destroy()
        }, 3)
    }

    public onDestroy() {
        this.eggPod.removeEggFromEggList(this)
        this.eggPod = undefined
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this.isDestorying) return

        if (otherCollider.tag == selfCollider.tag) {
            var eggView = otherCollider.getComponent(EggView)

            // check is already in list
            if (!this.eggPod.eggList.find((x) => x == eggView)) {
                //add new egg at list for all element in list
                this.eggPod.addEggToEggList(eggView)
            }

            // add new same type egg at list
            if (eggView.eggPod.bean.type == this.eggPod.bean.type) {
                if (!this.eggPod.eggListInType.find((x) => x == eggView)) this.eggPod.addEggToEggListInType(eggView)
            }

            if (this.isBullet) this.OnEggCollision(selfCollider, otherCollider)
        }
    }
}
