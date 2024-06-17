import {
    _decorator,
    BoxCollider2D,
    CCFloat,
    Component,
    Contact2DType,
    instantiate,
    Node,
    Prefab,
    resources,
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

    @property({ type: CCFloat })
    private settingEggCount: number

    @property({ type: Node })
    private canvas: Node

    @property({ type: BoxCollider2D })
    private collider: BoxCollider2D

    @property({ type: Vec2 })
    private offset: Vec2

    @property({ type: CCFloat })
    startGameSpeed: number

    private heightSize: number
    private gameplayPod: GameplayPod

    private beanList: Array<EggBean>

    public async doInit() {
        console.log('Init Spawner')
        this.gameplayPod = GameplayPod.instance
        this.gameplayPod.gameplayPodEventTarget.emit('gameSpeed', this.startGameSpeed)

        await resources.load('Data/EggData', (err, asset: any) => {
            if (err) console.log(err)
            else {
                this.beanList = asset.json

                for (let i = 0; i < 10; i++) {
                    if (i % 2 == 0) this.spawnEggGroup(this.settingEggCount, 0, i * this.offset.y)
                    else this.spawnEggGroup(this.settingEggCount, this.offset.x, i * this.offset.y)
                }
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
            egg.node.position.set(
                this.node.position.x + (this.prefabRadius + i * 50) + distanceX,
                this.node.position.y + this.prefabRadius - distanceY
            )
            this.canvas.addChild(egg.node)
        }
    }

    private timer: number = 0
    private count: number = 0
    update(deltaTime: number) {
        this.timer += deltaTime * this.startGameSpeed
        if (this.timer >= this.offset.y) {
            this.timer = 0
            console.log('spawn')
            if (this.count % 2 == 0) this.spawnEggGroup(this.settingEggCount, 0, 0)
            else this.spawnEggGroup(this.settingEggCount, this.offset.x, 0)
            this.count++
        }
    }
}
