import { _decorator, Component, Node } from 'cc'
import { SpawnerView } from './SpawnerView'
const { ccclass, property } = _decorator

@ccclass('GameInit')
export class GameInit extends Component {
    @property({
        type: SpawnerView,
    })
    public spawnerView: SpawnerView

    start() {
        this.spawnerView.Init()
    }

    update(deltaTime: number) {}
}
