import { _decorator, AssetManager, assetManager, Component, ImageAsset, Node, resources, SpriteFrame } from 'cc'
import { SpawnerView } from './SpawnerView'
import { GameOverView } from './Gameobject/GameOverView'
import { SlingShotController } from './SlingShotController'
import { GameplayPod } from './Pods/GameplayPod'
import { ScoreUIView } from './ScoreUIView'
import { NextEggSpawnUIView } from './NextEggSpawnUIView'
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

    @property({ type: ScoreUIView })
    public scoreUIView: ScoreUIView

    @property(NextEggSpawnUIView)
    public nextEggSpawnUI: NextEggSpawnUIView

    @property({ type: SlingShotController })
    public slingshotController: SlingShotController
    private gameplayPod: GameplayPod

    start() {
        this.init()
    }

    private async init() {
        this.gameplayPod = GameplayPod.instance

        await this.loadEggData()

        this.spawnerView.doInit()
        this.gameOverView.doInit()
        this.slingshotController.doInit()
        this.scoreUIView.doInit()
        this.nextEggSpawnUI.doInit()
    }

    private async loadEggData() {
        return new Promise<string>((resolve, reject) => {
            resources.load('Data/EggData', (err, asset: any) => {
                if (err) {
                    reject(err)
                } else {
                    console.log('Load EggData is Done')
                    this.gameplayPod.beanEggDataList = asset.json

                    resolve('load done')
                }
            })
        })
    }

    update(deltaTime: number) {}
}
