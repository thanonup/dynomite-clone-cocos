import { _decorator, Component, Graphics, resources } from 'cc'
import { SpawnerView } from './SpawnerView'
import { GameOverView } from './Gameobject/GameOverView'
import { SlingShotController } from './SlingShotController'
import { GameplayPod } from './Pods/GameplayPod'
import { UIPanelView } from './UI/UIPanelView'
import { LoaddingUIView } from './UI/LoaddingUIView'
import { GameSpeedControllerView } from './GameSpeedControllerView'
const { ccclass, property } = _decorator

@ccclass('GameInit')
export class GameInit extends Component {
    @property(Graphics)
    private backgroundTrim: Graphics

    @property({
        type: SpawnerView,
    })
    public spawnerView: SpawnerView

    @property({
        type: GameOverView,
    })
    public gameOverView: GameOverView

    @property({
        type: GameSpeedControllerView,
    })
    public gameSpeedControllerView: GameSpeedControllerView

    @property(UIPanelView)
    public uiPanelView: UIPanelView

    @property({ type: SlingShotController })
    public slingshotController: SlingShotController
    private gameplayPod: GameplayPod

    start() {
        LoaddingUIView.Instance.showLoadding()

        this.init()
    }

    private async init() {
        this.gameplayPod = GameplayPod.instance

        const width = window.innerWidth * 2
        const height = window.innerHeight * 2
        this.backgroundTrim.rect(-width / 2, -height / 2, width, height)
        this.backgroundTrim.fill()

        await this.loadEggData()

        this.spawnerView.doInit()
        this.gameOverView.doInit()
        this.slingshotController.doInit()
        this.uiPanelView.doInit()
        this.gameSpeedControllerView.doInit()

        LoaddingUIView.Instance.hideLoadding()
    }

    private async loadEggData() {
        return new Promise<string>((resolve, reject) => {
            resources.load('Data/EggData', (err, asset: any) => {
                if (err) {
                    reject(err)
                } else {
                    // console.log('Load EggData is Done')
                    this.gameplayPod.beanEggDataList = asset.json

                    resolve('load done')
                }
            })
        })
    }

    update(deltaTime: number) {}
}
