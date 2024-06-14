import { _decorator, assetManager, Component, ImageAsset, Node, resources, SpriteFrame } from 'cc'
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
        this.init()
    }

    private async init() {
        await this.loadAsset()

        this.spawnerView.doInit()
        this.gameOverView.doInit()
    }

    private async loadAsset() {}

    update(deltaTime: number) {}
}
