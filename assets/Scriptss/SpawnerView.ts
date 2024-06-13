import { _decorator, CCFloat, Component, instantiate, Layout, Node, Prefab, tween, Vec2, Vec3 } from 'cc'
import { EggView } from './Gameobject/EggView'
import { GameplayPod } from './Pods/GameplayPod'
import { GameplayState } from './States/GameplayState'

const { ccclass, property } = _decorator

@ccclass('SpawnerView')
export class SpawnerView extends Component {
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

    private currentSpeed: number
    private eggGroup = []
    private gameplayPod: GameplayPod

    public doInit() {
        console.log('Init Spawner')

        this.gameplayPod = GameplayPod.instance

        const countAll = this.settingEggCountXY.x * this.settingEggCountXY.y
        const eggGroup = instantiate(this.eggPrefebGroup)
        eggGroup.mobility = 2
        this.spawnerObject.addChild(eggGroup)
        this.eggGroup.push(eggGroup)

        const layout: Layout = eggGroup.getComponent(Layout)
        layout.constraintNum = this.settingEggCountXY.x
        for (let i = 0; i < countAll; i++) {
            let egg = instantiate(this.eggPrefeb)
            eggGroup.addChild(egg)
        }
        layout.enabled = true

        this.scheduleOnce(() => {
            console.log('turn off grid layouts')
            layout.enabled = false
        }, 0.2)
    }

    update(deltaTime: number) {
        if (this.gameplayPod.gameState == GameplayState.GameOver) return

        this.currentSpeed = this.speedMove * deltaTime
        this.eggGroup.forEach((x: Node) => {
            x.setPosition(0, x.position.y - 1 * this.currentSpeed, 0)
        })
    }
}
