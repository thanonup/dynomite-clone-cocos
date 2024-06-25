import {
    _decorator,
    BoxCollider2D,
    CCFloat,
    Collider2D,
    Component,
    Contact2DType,
    instantiate,
    IPhysics2DContact,
    Node,
    NodePool,
    Prefab,
    UITransform,
    Vec2,
} from 'cc'
import { EggView } from './Gameobject/EggView'
import { GameplayPod } from './Pods/GameplayPod'
import { GameConfig } from './GameConfig'
import { GameplayState } from './States/GameplayState'

const { ccclass, property } = _decorator

@ccclass('SpawnerView')
export class SpawnerView extends Component {
    // public static readonly POSITION_SPAWN: number = 20

    @property({
        type: Prefab,
    })
    private eggPrefab: EggView

    @property({
        type: CCFloat,
    })
    private prefabRadius: number

    @property({
        type: Node,
    })
    private spawnerObject

    @property({ type: Vec2 })
    private settingEggRowAndColumn: Vec2

    @property({ type: Node })
    private canvas: Node

    @property({ type: BoxCollider2D })
    private collider: BoxCollider2D

    @property({ type: Vec2 })
    private offset: Vec2

    @property({ type: CCFloat })
    startGameSpeed: number

    private gameplayPod: GameplayPod

    private heightSize: number
    private timer: number = 0
    private count: number = 0

    private isStart: boolean = false

    public pool = new NodePool()

    private eggviewList: Array<EggView> = new Array<EggView>()

    public doInit() {
        console.log('Init Spawner')
        this.initPool()

        this.gameplayPod = GameplayPod.instance
        this.gameplayPod.gameplayPodEventTarget.emit('gameSpeed', this.startGameSpeed)

        this.gameplayPod.beanEggDataSpawnerList = [
            this.gameplayPod.beanEggDataList[0],
            this.gameplayPod.beanEggDataList[1],
            this.gameplayPod.beanEggDataList[2],
        ]

        this.spawnEggGroup(this.settingEggRowAndColumn.x, 0, 0).forEach((x) => {
            this.eggviewList.push(x)
        })

        for (let i = 1; i < this.settingEggRowAndColumn.y; i++) {
            if (i % 2 == 0) {
                this.spawnEggGroup(this.settingEggRowAndColumn.x, 0, i * this.offset.y)
            } else this.spawnEggGroup(this.settingEggRowAndColumn.x, this.offset.x, i * this.offset.y)
        }

        this.isStart = true

        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this)
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == 99) {
            var eggView = otherCollider.getComponent(EggView)

            if (eggView.isOnGrid && !this.eggviewList.find((x) => x == eggView)) {
                this.eggviewList.push(eggView)
            }
        }
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.tag == 99) {
            var eggView = otherCollider.getComponent(EggView)

            const index = this.eggviewList.indexOf(eggView, 0)
            if (index > -1) this.eggviewList.splice(index, 1)
        }
    }

    private initPool() {
        let initCount = this.settingEggRowAndColumn.x * this.settingEggRowAndColumn.y
        for (let i = 0; i < initCount; i++) {
            let egg = instantiate(this.eggPrefab).getComponent(EggView)
            egg.doInit(this.pool)
            this.pool.put(egg.node)
        }
    }

    public getFromPool(): EggView {
        if (this.pool.size() > 0) {
            return this.pool.get().getComponent(EggView)
        } else {
            let egg = instantiate(this.eggPrefab).getComponent(EggView)
            egg.doInit(this.pool)
            return egg
        }
    }

    private spawnEggGroup(countAll: number, distanceX?: number, distanceY?: number): Array<EggView> {
        var egglist = new Array<EggView>()
        for (let i = 0; i < countAll; i++) {
            var randomNumber = Math.floor(Math.random() * this.gameplayPod.beanEggDataSpawnerList.length)
            var bean = this.gameplayPod.beanEggDataList[randomNumber]

            let egg: EggView = this.getFromPool().getComponent(EggView)
            egg.node.name = 'Egg ' + i + ' ' + bean.type
            egg.updateCurrentLineSpawn(this.count)

            const spawnerSize = this.node.getComponent(UITransform).width
            egg.node.position.set(
                -spawnerSize / 2 + (this.prefabRadius + i * 50) + distanceX + 2.5,
                this.node.position.y - distanceY
            )
            egg.eggPod.ChangeBean(bean, true)

            this.canvas.addChild(egg.node)
            egglist.push(egg)
        }

        this.count++

        if (this.count == GameConfig.NEXT_SPAWN_NEW_EGG_1) {
            if (this.gameplayPod.beanEggDataSpawnerList.indexOf(this.gameplayPod.beanEggDataList[3]) == -1) {
                this.gameplayPod.beanEggDataSpawnerList.push(this.gameplayPod.beanEggDataList[3])
            }
        } else if (this.count == GameConfig.NEXT_SPAWN_NEW_EGG_2) {
            if (this.gameplayPod.beanEggDataSpawnerList.indexOf(this.gameplayPod.beanEggDataList[4]) == -1) {
                this.gameplayPod.beanEggDataSpawnerList.push(this.gameplayPod.beanEggDataList[4])
            }
        }

        this.isStart = true
        return egglist
    }

    update(deltaTime: number) {
        if (GameplayPod.instance.gameState != GameplayState.GamePlay) return

        if (!this.isStart) return
        this.timer += deltaTime * this.startGameSpeed
        if (this.eggviewList.length == 0) {
            this.timer = 0
            if (this.count % 2 == 1) this.spawnEggGroup(this.settingEggRowAndColumn.x, 0, 0)
            else this.spawnEggGroup(this.settingEggRowAndColumn.x, this.offset.x, 0)
        }
    }
}
