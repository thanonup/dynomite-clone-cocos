import {
    _decorator,
    CCBoolean,
    CircleCollider2D,
    Collider2D,
    Color,
    Component,
    Contact2DType,
    IPhysics2DContact,
    RigidBody2D,
    Sprite,
    UITransform,
    Vec2,
    Vec3,
} from 'cc'
import { EggPod } from '../Pods/EggPod'
import { EggBean } from '../Bean/EggBean'
const { ccclass, property } = _decorator

@ccclass('EggView')
export class EggView extends Component {
    @property({
        type: Sprite,
    })
    public eggGraphics: Sprite

    @property({ type: CircleCollider2D })
    collider: CircleCollider2D

    @property({ type: RigidBody2D })
    rb: RigidBody2D

    @property({ type: Vec2 })
    positionRef: Vec2

    @property({ type: CCBoolean })
    isOnGrid: boolean
    @property({ type: CCBoolean })
    isFalling: boolean

    public eggPod: EggPod

    isCollided: boolean = false
    targetPosition: Vec3

    start() {
        this.eggPod = new EggPod()
        this.eggPod.eggList.push(this)

        // this.doInit()
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
    }

    public doInit(isGrid: boolean) {
        this.isOnGrid = isGrid
        // this.eggPod.bean = eggBean
        // this.eggGraphics.circle(0, 0, 25)
        // this.eggGraphics.fillColor = new Color('#ff0000')
        // this.eggGraphics.fill()
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == selfCollider.tag) {
            var eggView = otherCollider.getComponent(EggView)

            // Check is Already in list
            if (!this.eggPod.eggList.find((x) => x == eggView)) {
                //Add new egg to list for all element in list
                this.eggPod.eggList.forEach((eggElement) => {
                    eggView.eggPod.eggList.forEach((egg) => {
                        if (!eggElement.eggPod.eggList.find((x) => x == egg)) eggElement.eggPod.eggList.push(egg)
                    })
                })
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

        if (this.isOnGrid) return
    }
}
