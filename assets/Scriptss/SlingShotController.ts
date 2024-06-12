import { _decorator, Component, EventMouse, Input, input, Node, RigidBody2D, Canvas, UITransform, Vec2, Vec3 } from 'cc'
const { ccclass, property } = _decorator

@ccclass('SlingShotController')
export class SlingShotController extends Component {
    @property({ type: UITransform })
    canvas: UITransform

    @property({ type: RigidBody2D })
    ball: RigidBody2D

    speed = 0
    start() {
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this)
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this)
    }

    update(deltaTime: number) {}

    private onMouseDown(event: EventMouse) {
        if (this.ball == undefined) return

        this.ball.linearVelocity = this.multiplyVec2(this.getDirectionformBall(event), 10)
        this.ball = undefined
    }

    private getDirectionformBall(event: EventMouse): any {
        return this.subTractionVec2(
            this.getMousePositionInCanvas(event),
            this.convertVec3ToVec2(this.ball.node.position)
        ).normalize()
    }

    private onMouseUp(event: EventMouse) {
        // console.log(this.getMousePositionInCanvas(event))
    }

    private getMousePositionInCanvas(event: EventMouse): Vec2 {
        var position = new Vec2()
        position.x = event.getUILocationX() - this.canvas.width / 2
        position.y = event.getUILocationY() - this.canvas.height / 2

        return position
    }

    private subTractionVec2(vec_1: Vec2, vec_2: Vec2): Vec2 {
        var vec = new Vec2(vec_1.x - vec_2.x, vec_1.y - vec_2.y)
        return vec
    }

    private multiplyVec2(vec: Vec2, multiply: number): Vec2 {
        return new Vec2(vec.x * multiply, vec.y * multiply)
    }

    private convertVec3ToVec2(vec: Vec3): Vec2 {
        return new Vec2(vec.x, vec.y)
    }
}
