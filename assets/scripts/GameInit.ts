import { _decorator, Component, Node } from 'cc'
import { SpawnerView } from './SpawnerView'
import { GameOverView } from './Gameobject/GameOverView'
const { ccclass, property } = _decorator

@ccclass('GameInit')
export class GameInit extends Component {
    @property({
        type: SpawnerView,
    })
    public spawnerView: SpawnerView

    @property({
        type: GameOverView,
    })
    public gameOverView: GameOverView

    start() {
        this.spawnerView.doInit()
        this.gameOverView.doInit()
    }

    update(deltaTime: number) {}
}
