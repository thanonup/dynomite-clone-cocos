import {
    _decorator,
    BoxCollider2D,
    CCFloat,
    Component,
    instantiate,
    Node,
    NodePool,
    Prefab,
    resources,
    UITransform,
    Vec2,
} from 'cc'
import { EggView } from './Gameobject/EggView'
import { GameplayPod } from './Pods/GameplayPod'
import { GameplayState } from './States/GameplayState'
import { EggBean } from './Bean/EggBean'
import { GameConfig } from './GameConfig'

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

    public doInit() {
        console.log('Init Spawner')
        this.gameplayPod = GameplayPod.instance
        this.gameplayPod.gameplayPodEventTarget.emit('gameSpeed', this.startGameSpeed)

        this.gameplayPod.beanEggDataSpawnerList = [
            this.gameplayPod.beanEggDataList[0],
            this.gameplayPod.beanEggDataList[1],
            this.gameplayPod.beanEggDataList[2],
        ]

        this.initPool()

        for (let i = 0; i < this.settingEggRowAndColumn.y; i++) {
            if (i % 2 == 0)
                this.spawnEggGroup(
                    this.settingEggRowAndColumn.x,
                    0,
                    this.offset.y * (this.settingEggRowAndColumn.y - i)
                )
            else
                this.spawnEggGroup(
                    this.settingEggRowAndColumn.x,
                    this.offset.x,
                    this.offset.y * (this.settingEggRowAndColumn.y - i)
                )
        }
    }

    private initPool() {
        let initCount = 11
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

    private spawnEggGroup(countAll: number, distanceX?: number, distanceY?: number) {
        for (let i = 0; i < countAll; i++) {
            var randomNumber = Math.floor(Math.random() * this.gameplayPod.beanEggDataSpawnerList.length)
            var bean = this.gameplayPod.beanEggDataList[randomNumber]

            let egg: EggView = this.getFromPool().getComponent(EggView)
            egg.node.name = 'Egg ' + i + ' ' + bean.type
            egg.updateCurrentLineSpawn(this.count)

            const spawnerSize = this.node.getComponent(UITransform).width
            egg.node.position.set(
                -spawnerSize / 2 + (this.prefabRadius + i * 50) + distanceX + 2.5,
                this.node.position.y + this.prefabRadius - distanceY
            )
            egg.eggPod.ChangeBean(bean, true)

            this.canvas.addChild(egg.node)
        }

        this.count++

        if (this.count == GameConfig.NEXT_SPAWN_NEW_EGG_1) {
            this.gameplayPod.beanEggDataSpawnerList.push(this.gameplayPod.beanEggDataList[3])
        } else if (this.count == GameConfig.NEXT_SPAWN_NEW_EGG_2) {
            this.gameplayPod.beanEggDataSpawnerList.push(this.gameplayPod.beanEggDataList[4])
        }

        this.isStart = true
    }

    update(deltaTime: number) {
        if (!this.isStart) return
        this.timer += deltaTime * this.startGameSpeed
        if (this.timer >= this.offset.y) {
            this.timer = 0
            if (this.count % 2 == 1) this.spawnEggGroup(this.settingEggRowAndColumn.x, 0, 0)
            else this.spawnEggGroup(this.settingEggRowAndColumn.x, this.offset.x, 0)
        }
    }
}
