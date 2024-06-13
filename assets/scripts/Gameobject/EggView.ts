import {
    _decorator,
    CircleCollider2D,
    Collider2D,
    Color,
    Component,
    Contact2DType,
    ERigidBody2DType,
    Graphics,
    IPhysics2DContact,
    Node,
    RigidBody2D,
    UITransform,
    Vec2,
    Vec3,
} from 'cc'
const { ccclass, property } = _decorator

@ccclass('EggView')
export class EggView extends Component {
    @property({
        type: Graphics,
    })
    public eggGraphics: Graphics

    @property({ type: CircleCollider2D })
    collider: CircleCollider2D

    @property({ type: RigidBody2D })
    rb: RigidBody2D

    @property({ type: Vec2 })
    positionRef: Vec2

    @property({ type: Boolean })
    isOnGrid: boolean
    @property({ type: Boolean })
    isFalling: boolean

    isCollided: boolean = false
    targetPosition: Vec3

    start() {
        // this.doInit()
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
    }

    doInit() {
        this.eggGraphics.circle(0, 0, 25)
        this.eggGraphics.fillColor = new Color('#ff0000')
        this.eggGraphics.fill()
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this.isOnGrid) return

        if (otherCollider.tag == selfCollider.tag) this.OnEggCollision(selfCollider, otherCollider)
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
