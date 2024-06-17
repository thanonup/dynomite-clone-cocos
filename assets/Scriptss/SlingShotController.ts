import {
    _decorator,
    Component,
    EventMouse,
    Input,
    instantiate,
    Prefab,
    resources,
    RigidBody2D,
    UITransform,
    Vec2,
    Vec3,
} from 'cc'
import { EggBean } from './Bean/EggBean'
import { EggView } from './Gameobject/EggView'
const { ccclass, property } = _decorator

@ccclass('SlingShotController')
export class SlingShotController extends Component {
    @property({
        type: Prefab,
    })
    public eggPrefeb: EggView

    @property({ type: UITransform })
    canvas: UITransform

    @property({ type: RigidBody2D })
    egg: RigidBody2D

    power = 30

    private beanList: Array<EggBean>

    public doInit() {
        resources.load('Data/EggData', (err, asset: any) => {
            if (err) console.error(err)
            else {
                this.beanList = asset.json
                this.canvas.node.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this)
                this.canvas.node.on(Input.EventType.MOUSE_UP, this.onMouseUp, this)
                this.spawnEgg()
            }
        })
    }

    private spawnEgg() {
        var randomNumber = Math.floor(Math.random() * this.beanList.length)
        let egg: EggView = instantiate(this.eggPrefeb).getComponent(EggView)
        egg.doInit(this.beanList[randomNumber], false)
        this.egg = egg.rb
        this.canvas.node.addChild(egg.node)
        this.egg.node.position = this.node.position
    }

    update(deltaTime: number) {}

    private onMouseDown(event: EventMouse) {
        if (this.egg == undefined) return
    }

    private onMouseUp(event: EventMouse) {
        if (this.egg == undefined) return
        this.egg.linearVelocity = this.multiplyVec2(this.getDirectionformBall(event), this.power)
        this.egg = undefined

        setTimeout(() => this.spawnEgg(), 1000)
    }

    private getDirectionformBall(event: EventMouse): any {
        return this.subTractionVec2(
            this.getMousePositionInCanvas(event),
            this.convertVec3ToVec2(this.egg.node.position)
        ).normalize()
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

    private sumTractionVec2(vec_1: Vec2, vec_2: Vec2): Vec2 {
        var vec = new Vec2(vec_1.x + vec_2.x, vec_1.y + vec_2.y)
        return vec
    }

    private multiplyVec2(vec: Vec2, multiply: number): Vec2 {
        return new Vec2(vec.x * multiply, vec.y * multiply)
    }

    private convertVec3ToVec2(vec: Vec3): Vec2 {
        return new Vec2(vec.x, vec.y)
    }
}
