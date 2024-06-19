import {
    _decorator,
    BoxCollider2D,
    CCFloat,
    Component,
    instantiate,
    Node,
    Prefab,
    resources,
    UITransform,
    Vec2,
} from 'cc'
import { EggView } from './Gameobject/EggView'
import { GameplayPod } from './Pods/GameplayPod'
import { GameplayState } from './States/GameplayState'
import { EggBean } from './Bean/EggBean'

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

    isLoaded: boolean = false

    private gameplayPod: GameplayPod
    private beanList: Array<EggBean>

    private heightSize: number
    private timer: number = 0
    private count: number = 0

    public async doInit() {
        console.log('Init Spawner')
        this.gameplayPod = GameplayPod.instance
        this.gameplayPod.gameplayPodEventTarget.emit('gameSpeed', this.startGameSpeed)

        await resources.load('Data/EggData', (err, asset: any) => {
            if (err) console.log(err)
            else {
                this.beanList = asset.json

                for (let i = 0; i < this.settingEggRowAndColumn.y; i++) {
                    if (i % 2 == 0) this.spawnEggGroup(this.settingEggRowAndColumn.x, 0, i * this.offset.y)
                    else this.spawnEggGroup(this.settingEggRowAndColumn.x, this.offset.x, i * this.offset.y)
                }

                this.isLoaded = true
            }
        })
    }

    private spawnEggGroup(countAll: number, distanceX?: number, distanceY?: number) {
        for (let i = 0; i < countAll; i++) {
            var randomNumber = Math.floor(Math.random() * this.beanList.length)
            var bean = this.beanList[randomNumber]
            let egg = instantiate(this.eggPrefab).getComponent(EggView)
            egg.doInit(bean, true)
            egg.node.name += ' ' + i + ' ' + bean.type
            const spawnerSize = this.node.getComponent(UITransform).width
            egg.node.position.set(
                -spawnerSize / 2 + (this.prefabRadius + i * 50) + distanceX + 2.5,
                this.node.position.y + this.prefabRadius - distanceY
            )
            this.canvas.addChild(egg.node)
        }
    }

    update(deltaTime: number) {
        if (!this.isLoaded) return

        this.timer += deltaTime * this.startGameSpeed
        if (this.timer >= this.offset.y) {
            this.timer = 0
            if (this.count % 2 == 1) this.spawnEggGroup(this.settingEggRowAndColumn.x, 0, 0)
            else this.spawnEggGroup(this.settingEggRowAndColumn.x, this.offset.x, 0)
            this.count++
        }
    }
}
