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
} from 'cc'
import { EggPod } from '../Pods/EggPod'
import { EggBean } from '../Bean/EggBean'
import { AssetManagerManual } from '../Managers/AssetManagerManual'
const { ccclass, property } = _decorator

@ccclass('EggView')
export class EggView extends Component {
    @property
    eggSprite: Sprite
    @property
    collider: CircleCollider2D
    @property
    public rb: RigidBody2D
    @property
    positionRef: Vec2
    @property({ type: CCBoolean })
    isOnGrid: boolean
    @property({ type: CCBoolean })
    isFalling: boolean

    @property({
        type: CCFloat,
    })
    public speedMove: number

    @property({ type: EggPod })
    public eggPod: EggPod

    isCollided: boolean = false
    targetPosition: Vec3

    public doInit(bean: EggBean, isGrid: boolean) {
        this.isOnGrid = isGrid
        this.eggPod = new EggPod()
        this.eggPod.eggList.push(this)
        this.eggPod.eggListInType.push(this)

        this.eggPod.beanEventTarget.on('Change', (bean: EggBean) => {
            this.eggSprite.getComponent(Sprite).spriteFrame = AssetManagerManual.instance.getAsset(bean.keySprite)
        })

        this.eggPod.ChangeBean(bean)

        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == selfCollider.tag) {
            var eggView = otherCollider.getComponent(EggView)

            // check is Already in list
            if (!this.eggPod.eggList.find((x) => x == eggView)) {
                //add new egg at list for all element in list
                this.eggPod.addEggToEggList(eggView)

                //add new same type egg at list
            }

            if (eggView.eggPod.bean.type == this.eggPod.bean.type) {
                if (!this.eggPod.eggListInType.find((x) => x == eggView)) this.eggPod.addEggToEggListInType(eggView)
            }
        }

        if (!this.isOnGrid) {
            if (otherCollider.tag == selfCollider.tag) this.OnEggCollision(selfCollider, otherCollider)
        }
    }

    private OnEggCollision(selfCollider: Collider2D, otherCollider: Collider2D) {
        this.rb.linearVelocity = new Vec2()
        this.targetPosition = this.getGridPosition(selfCollider, otherCollider)
        this.isCollided = true
        this.isOnGrid = true

        if (this.eggPod.eggListInType.length > 2) {
            this.eggPod.eggListInType.forEach((x) => x.node.destroy())
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
                    otherCollider.node.position.x - this.positionRef.x,
                    otherCollider.node.position.y - this.positionRef.y
                )
            else
                vec = new Vec3(
                    otherCollider.node.position.x + this.positionRef.x,
                    otherCollider.node.position.y - this.positionRef.y
                )
        } else {
            if (selfCollider.node.position.x < otherCollider.node.position.x)
                vec = new Vec3(
                    otherCollider.node.position.x - otherCollider.getComponent(UITransform).width,
                    otherCollider.node.position.y
                )
            else
                vec = new Vec3(
                    otherCollider.node.position.x + otherCollider.getComponent(UITransform).width,
                    otherCollider.node.position.y
                )
        }

        return vec
    }

    update(deltaTime: number) {
        if (this.isCollided) {
            this.node.setPosition(this.targetPosition)
            this.isCollided = false
        }

        this.collider.sensor = this.isOnGrid

        if (this.isOnGrid) {
            var yPosition = this.node.position.y - this.speedMove * deltaTime
            this.node.setPosition(this.node.position.x, yPosition, 0)
            // this.node.setPosition(this.node.position.x, this.node.position.y, 0)

            return
        }
    }

    public onDestroy() {
        this.eggPod.removeEggFromEggList(this)
        this.eggPod = undefined
    }
}
