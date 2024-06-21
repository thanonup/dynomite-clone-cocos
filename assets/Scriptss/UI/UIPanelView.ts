import { _decorator, Component, Node } from 'cc'
import { GameplayPod } from '../Pods/GameplayPod'
import { GameplayState } from '../States/GameplayState'
import { ScoreUIView } from './ScoreUIView'
import { NextEggSpawnUIView } from './NextEggSpawnUIView'
import { ResultUIView } from './ResultUIView'
const { ccclass, property } = _decorator

@ccclass('UIPanelView')
export class UIPanelView extends Component {
    @property(Node)
    public gameplayNode: Node

    @property({ type: ScoreUIView })
    public scoreUIView: ScoreUIView

    @property(NextEggSpawnUIView)
    public nextEggSpawnUI: NextEggSpawnUIView

    @property(Node)
    public resultNode: Node

    @property(ResultUIView)
    public resultUIView: ResultUIView

    private gameplayPod: GameplayPod

    public doInit() {
        this.gameplayPod = GameplayPod.instance

        this.scoreUIView.doInit()
        this.nextEggSpawnUI.doInit()
        this.resultUIView.doInit()

        this.doOnGameStateChange(this.gameplayPod.gameState)
        this.gameplayPod.gameplayPodEventTarget.on('gameState', (gameState: GameplayState) => {
            this.doOnGameStateChange(gameState)
        })
    }

    public doOnGameStateChange(gameState: GameplayState) {
        this.gameplayNode.active = gameState == GameplayState.GamePlay
        this.resultNode.active = gameState == GameplayState.GameOver

        // switch (gameState) {
        //     case GameplayState.GamePlay:
        //         break
        //     case GameplayState.GameOver:
        //         break
        // }
    }

    update(deltaTime: number) {}
}
