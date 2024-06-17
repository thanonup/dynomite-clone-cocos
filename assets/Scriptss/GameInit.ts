import { _decorator, Component, Node } from 'cc'
import { SpawnerView } from './SpawnerView'
import { GameOverView } from './Gameobject/GameOverView'
import { SlingShotController } from './SlingShotController'
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

    @property({ type: SlingShotController })
    public slingshotController: SlingShotController

    start() {
        this.spawnerView.doInit()
        this.gameOverView.doInit()
        this.slingshotController.doInit()
    }

    update(deltaTime: number) {}
}
