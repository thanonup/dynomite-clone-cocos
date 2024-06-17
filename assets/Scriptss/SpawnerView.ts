import {
    _decorator,
    CCFloat,
    Component,
    instantiate,
    JsonAsset,
    Layout,
    loader,
    Node,
    Prefab,
    resources,
    SpriteFrame,
    tween,
    UITransform,
    Vec2,
    Vec3,
} from 'cc'
import { EggView } from './Gameobject/EggView'
import { GameplayPod } from './Pods/GameplayPod'
import { GameplayState } from './States/GameplayState'
import { EggBean } from './Bean/EggBean'

const { ccclass, property } = _decorator

@ccclass('SpawnerView')
export class SpawnerView extends Component {
    public static readonly POSITION_SPAWN: number = 20

    @property({
        type: Prefab,
    })
    public eggPrefeb: EggView

    @property({
        type: Prefab,
    })
    public eggPrefebGroup

    @property({
        type: Node,
    })
    public spawnerObject

    @property({
        type: Vec2,
    })
    public settingEggCountXY: Vec2

    @property({
        type: CCFloat,
    })
    public speedMove: number

    private heightSize: number
    private currentSpeed: number
    private spawnLoopCount: number = 0
    private eggGroup = []
    private gameplayPod: GameplayPod

    protected onLoad(): void {
        this.gameplayPod = GameplayPod.instance
    }

    public doInit() {
        console.log('Init Spawner')

        this.spawnEggGroup(100)

        this.gameplayPod.gameStateEventTarget.on(
            'gameState',
            (state: GameplayState) => {
                if (state == GameplayState.GamePlay) {
                    this.spawnLoopCount = 0
                }
            },
            this
        )
    }

    private spawnEggGroup(yPostion: number) {
        const countAll = this.settingEggCountXY.x * this.settingEggCountXY.y
        const eggGroup = instantiate(this.eggPrefebGroup)
        eggGroup.setPosition(new Vec3(0, yPostion, 0))
        eggGroup.mobility = 2
        this.spawnerObject.addChild(eggGroup)
        this.eggGroup.push(eggGroup)

        const layout: Layout = eggGroup.getComponent(Layout)
        layout.constraintNum = this.settingEggCountXY.x
        layout.enabled = true

        for (let i = 0; i < countAll; i++) {
            var randomNumber = Math.floor(
                Math.random() * (this.gameplayPod.beanEggDataList.length - (2 - this.spawnLoopCount))
            )
            let egg = instantiate(this.eggPrefeb)
            egg.getComponent(EggView).doInit(this.gameplayPod.beanEggDataList[randomNumber], true)
            eggGroup.addChild(egg)
        }

        this.gameplayPod.firstLoad = true

        this.scheduleOnce(() => {
            console.log('turn off grid layouts')
            layout.enabled = false
        }, 0.2)

        this.heightSize = eggGroup.getComponent(UITransform).height

        if (this.spawnLoopCount < 2) {
            this.spawnLoopCount++
        }
    }

    update(deltaTime: number) {
        if (this.gameplayPod.gameState == GameplayState.GameOver) return

        if (this.gameplayPod.firstLoad) {
            this.currentSpeed = this.speedMove * deltaTime
            this.eggGroup.forEach((x: Node) => {
                x.setPosition(0, x.position.y - 1 * this.currentSpeed, 0)
            })

            if (this.eggGroup[this.eggGroup.length - 1].position.y < SpawnerView.POSITION_SPAWN) {
                this.spawnEggGroup(this.heightSize + SpawnerView.POSITION_SPAWN)
            }
        }
    }
}
