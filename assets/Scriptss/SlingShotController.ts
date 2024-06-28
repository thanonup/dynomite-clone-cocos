import {
    _decorator,
    CCFloat,
    Collider,
    Collider2D,
    Color,
    Component,
    debug,
    director,
    ERaycast2DType,
    EventMouse,
    Graphics,
    Input,
    Node,
    PhysicsSystem2D,
    Prefab,
    RaycastResult2D,
    UITransform,
    Vec2,
    Vec3,
} from 'cc'
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

    @property({ type: Graphics })
    graphics: Graphics

    @property(Node)
    private spawnerNode: Node

    @property({ type: CCFloat })
    power: number = 30

    private gameplayPod: GameplayPod
    private isCanInteract: boolean = true

    private idTimeOut: number
    private drawing: boolean

    public doInit() {
        this.gameplayPod = GameplayPod.instance

        this.gameplayPod.beanEggDataSlingList = [
            this.gameplayPod.beanEggDataList[0],
            this.gameplayPod.beanEggDataList[1],
            this.gameplayPod.beanEggDataList[2],
        ]

        this.canvas.node.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this)
        this.canvas.node.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this)
        this.canvas.node.on(Input.EventType.MOUSE_UP, this.onMouseUp, this)

        this.canvas.node.on(Input.EventType.TOUCH_START, this.onMouseDown, this)
        this.canvas.node.on(Input.EventType.TOUCH_MOVE, this.onMouseMove, this)
        this.canvas.node.on(Input.EventType.TOUCH_END, this.onMouseUp, this)

        this.spawnEgg()

        this.gameplayPod.gameplayPodEventTarget.on('gameState', (gameState: GameplayState) => {
            switch (gameState) {
                case GameplayState.PreStart:
                    this.spawnEgg()

                    setTimeout(() => (this.isCanInteract = true), 500)
                    break
                case GameplayState.GameOver:
                    clearTimeout(this.idTimeOut)
                    this.isCanInteract = false
                    this.egg?.onGameOver()
                    break
            }
        })
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
        this.egg.isBullet = true
        this.egg.eggPod.ChangeBean(randomBean, false)
        this.spawnerNode.addChild(this.egg.node)
        this.egg.node.position = this.node.position
        this.egg.collider.enabled = false
        this.egg.node.name = 'Egg Bullet ' + randomBean.type
    }

    update(deltaTime: number) {}

    private drawRaycast(startPoind: Vec2, endPoind: Vec2) {
        var direction = this.subTractionVec2(startPoind, endPoind).normalize()
        // this.graphics.clear()
        this.graphics.strokeColor = Color.RED
        this.graphics.lineWidth = 12.5
        endPoind = this.calculateEndpoint(endPoind, direction, 25)
        this.graphics.moveTo(startPoind.x, startPoind.y)
        this.graphics.lineTo(endPoind.x, endPoind.y)

        let smoothPoints = this.getSmoothPoints(startPoind, endPoind)

        this.graphics.moveTo(smoothPoints[0].x, smoothPoints[0].y)
        for (let i = 1; i < smoothPoints.length; i++) {
            this.graphics.lineTo(smoothPoints[i].x, smoothPoints[i].y)
        }

        this.graphics.stroke()
    }

    getSmoothPoints(start: Vec2, end: Vec2): Vec2[] {
        let points: Vec2[] = []
        let segments = 50 // ปรับจำนวนจุดเพื่อความเรียบเนียนของเส้น

        for (let i = 0; i <= segments; i++) {
            let t = i / segments
            let x = start.x * (1 - t) + end.x * t
            let y = start.y * (1 - t) + end.y * t
            points.push(new Vec2(x, y))
        }

        return points
    }

    private onMouseDown(event: EventMouse) {
        if (
            this.gameplayPod.gameState != GameplayState.GamePlay &&
            this.gameplayPod.gameState != GameplayState.PreStart
        )
            return

        if (this.egg == undefined) return

        this.drawing = true
        this.drawIndicator(event)
    }

    private onMouseMove(event: EventMouse) {
        if (
            this.gameplayPod.gameState != GameplayState.GamePlay &&
            this.gameplayPod.gameState != GameplayState.PreStart
        )
            return

        if (this.egg == undefined) return

        if (!this.drawing) return

        this.drawIndicator(event)
    }

    private drawIndicator(event: EventMouse) {
        this.graphics.clear()
        var mousePosition = event.getUILocation()
        var startPoint = this.convertVec3ToVec2(this.node.worldPosition)
        var direction = this.subTractionVec2(mousePosition, startPoint).normalize()
        var endPoint = this.calculateEndpoint(startPoint, direction, 1000)
        var raycastPosition = this.raycastCollision(startPoint, endPoint)

        var startDraw = new Vec2()
        var endDraw = new Vec2()

        if (raycastPosition != undefined) {
            endDraw = this.subTractionVec2(
                raycastPosition.point,
                new Vec2(this.canvas.width / 2, this.node.worldPosition.y)
            )

            this.drawRaycast(startDraw, endDraw)
        }
        while (raycastPosition != undefined && raycastPosition.collider.tag != 99) {
            // startPoint = raycastPosition.point
            var comingDirection = this.subTractionVec2(startDraw, endDraw).normalize()
            startPoint = this.calculateEndpoint(raycastPosition.point, comingDirection, 25)
            direction.x *= -1
            endPoint = this.calculateEndpoint(startPoint, direction, 1000)

            comingDirection.x *= -1
            endPoint = this.calculateEndpoint(endPoint, comingDirection, 25)

            raycastPosition = this.raycastCollision(startPoint, endPoint)

            startDraw = this.subTractionVec2(startPoint, new Vec2(this.canvas.width / 2, this.node.worldPosition.y))

            if (raycastPosition != undefined) {
                endDraw = this.subTractionVec2(
                    raycastPosition.point,
                    new Vec2(this.canvas.width / 2, this.node.worldPosition.y)
                )
            } else {
                endDraw = this.subTractionVec2(endPoint, new Vec2(this.canvas.width / 2, this.node.worldPosition.y))
            }

            this.drawRaycast(startDraw, endDraw)
        }
    }

    private raycastCollision(start: Vec2 | Vec3, end: Vec2): RaycastResult2D {
        const result = PhysicsSystem2D.instance.raycast(start, end, ERaycast2DType.All)

        if (result.length > 0) {
            var point = result.find((x) => x.collider.tag == 222 || x.collider.tag == 99)
            if (point != undefined) return point
            else return undefined
        } else return undefined
    }

    private onMouseUp(event: EventMouse) {
        if (!this.isCanInteract) return

        if (
            this.gameplayPod.gameState != GameplayState.GamePlay &&
            this.gameplayPod.gameState != GameplayState.PreStart
        )
            return
        if (this.egg == undefined) return

        this.drawing = false
        this.graphics.clear()
        if (this.gameplayPod.gameState == GameplayState.PreStart) {
            this.gameplayPod.gameplayPodEventTarget.emit('gameState', GameplayState.GamePlay)
        }

        this.egg.rb.linearVelocity = this.getDirectionformBall(event).multiplyScalar(this.power)
        this.egg.collider.enabled = true

        this.egg = undefined

        this.idTimeOut = setTimeout(() => this.spawnEgg(), 1000)
    }

    private calculateEndpoint(start: Vec2, direction: Vec2, distance: number): Vec2 {
        let startPoint = new Vec2(start)
        const endpoint = startPoint.add(direction.multiplyScalar(distance))

        return endpoint
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

    private convertVec3ToVec2(vec: Vec3): Vec2 {
        return new Vec2(vec.x, vec.y)
    }
}
