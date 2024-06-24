import { _decorator, Component, EventMouse, Input, Prefab, UITransform, Vec2, Vec3 } from 'cc'
import { EggView } from './Gameobject/EggView'
import { SpawnerView } from './SpawnerView'
import { GameplayPod } from './Pods/GameplayPod'
import { GameplayState } from './States/GameplayState'
const { ccclass, property } = _decorator

@ccclass('SlingShotController')
export class SlingShotController extends Component {
    @property({
        type: Prefab,
    })
    public eggPrefeb: EggView

    @property({ type: UITransform })
    canvas: UITransform

    @property({ type: SpawnerView })
    spawnerView: SpawnerView

    @property({ type: EggView })
    egg: EggView

    power = 30

    private gameplayPod: GameplayPod

    public doInit() {
        this.gameplayPod = GameplayPod.instance

        this.gameplayPod.beanEggDataSlingList = [
            this.gameplayPod.beanEggDataList[0],
            this.gameplayPod.beanEggDataList[1],
            this.gameplayPod.beanEggDataList[2],
        ]

        this.canvas.node.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this)
        this.canvas.node.on(Input.EventType.MOUSE_UP, this.onMouseUp, this)
        this.spawnEgg()
    }

    private spawnEgg() {
        const randomBean = this.gameplayPod.nextEggSpawnBean
            ? this.gameplayPod.nextEggSpawnBean
            : this.gameplayPod.beanEggDataList[Math.floor(Math.random() * this.gameplayPod.beanEggDataSlingList.length)]

        this.gameplayPod.gameplayPodEventTarget.emit(
            'nextEggSpawn',
            this.gameplayPod.beanEggDataList[Math.floor(Math.random() * this.gameplayPod.beanEggDataSlingList.length)]
        )
        this.egg = this.spawnerView.getFromPool().getComponent(EggView)
        this.egg.eggPod.ChangeBean(randomBean, false)
        this.canvas.node.addChild(this.egg.node)
        this.egg.node.position = this.node.position
        this.egg.collider.enabled = false
    }

    update(deltaTime: number) {}

    private onMouseDown(event: EventMouse) {
        if (
            this.gameplayPod.gameState != GameplayState.GamePlay &&
            this.gameplayPod.gameState != GameplayState.PreStart
        )
            return
        if (this.egg == undefined) return
    }

    private onMouseUp(event: EventMouse) {
        if (
            this.gameplayPod.gameState != GameplayState.GamePlay &&
            this.gameplayPod.gameState != GameplayState.PreStart
        )
            return
        if (this.egg == undefined) return

        if (this.gameplayPod.gameState == GameplayState.PreStart) {
            this.gameplayPod.gameplayPodEventTarget.emit('gameState', GameplayState.GamePlay)
        }

        this.egg.rb.linearVelocity = this.multiplyVec2(this.getDirectionformBall(event), this.power)
        this.egg.collider.enabled = true

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
