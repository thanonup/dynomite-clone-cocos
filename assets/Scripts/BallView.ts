import {
    _decorator,
    CircleCollider2D,
    Collider2D,
    Component,
    Contact2DType,
    director,
    IPhysics2DContact,
    RigidBody2D,
    Vec2,
} from 'cc'
const { ccclass, property } = _decorator

@ccclass('BallView')
export class BallView extends Component {
    @property({ type: RigidBody2D })
    rb: RigidBody2D
    @property({ type: CircleCollider2D })
    collider: CircleCollider2D

    start() {
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
    }

    update(deltaTime: number) {}

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D | null, contact: IPhysics2DContact | null) {
        // var vec = new Vec2(this.rb.linearVelocity)
        // if (otherCollider.tag == 1) {
        //     vec.x *= -1
        //     this.rb.linearVelocity = vec
        // }
        // if (otherCollider.tag == 2) {
        //     vec.y *= -1
        //     this.rb.linearVelocity = vec
        // }
    }
}
