import { _decorator, AssetManager, assetManager, Component, ImageAsset, Node, resources, SpriteFrame } from 'cc'
import { SpawnerView } from './SpawnerView'
import { GameOverView } from './Gameobject/GameOverView'
import { SlingShotController } from './SlingShotController'
import { GameplayPod } from './Pods/GameplayPod'
import { AssetManagerManual } from './Managers/AssetManagerManual'
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
    private gameplayPod: GameplayPod
    private assetManager: AssetManagerManual

    private assetData

    start() {
        this.init()
    }

    private async init() {
        this.gameplayPod = GameplayPod.instance
        this.assetManager = AssetManagerManual.instance

        await this.loadEggData()
        await this.loadAssetData()
        await this.assetManager.loadSpriteFrameData(this.assetData)

        this.spawnerView.doInit()
        this.gameOverView.doInit()
        this.slingshotController.doInit()
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

    private async loadAssetData() {
        return new Promise<string>((resolve, reject) => {
            resources.load('Data/SpriteAssetLoad', (err, asset: any) => {
                if (err) {
                    reject(err)
                } else {
                    console.log('Load SpriteAssetLoad is Done')
                    this.assetData = asset.json

                    resolve('load done')
                }
            })
        })
    }

    update(deltaTime: number) {}
}
