import { _decorator, Component, instantiate, Layout, Node, Prefab, Vec2 } from 'cc'
import { EggView } from './Gameobject/EggView'

const { ccclass, property } = _decorator

@ccclass('SpawnerView')
export class SpawnerView extends Component {
    @property({
        type: Prefab,
    })
    public eggPrefeb: EggView

    @property({
        type: Node,
    })
    public spawnerObject

    @property({
        type: Vec2,
    })
    public settingEggCountXY: Vec2

    @property({
        type: Layout,
    })
    public layout: Layout

    public Init() {
        console.log('Init Spawner')

        const countAll = this.settingEggCountXY.x * this.settingEggCountXY.y
        this.layout.constraintNum = this.settingEggCountXY.x
        for (let i = 0; i < countAll; i++) {
            let egg = instantiate(this.eggPrefeb)
            this.spawnerObject.addChild(egg)
        }

        this.layout.enabled = true
    }

    update(deltaTime: number) {}
}
