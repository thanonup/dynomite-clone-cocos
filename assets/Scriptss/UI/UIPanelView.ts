import { _decorator, Component, Node, tween, Vec2, Vec3 } from 'cc'
import { GameplayPod } from '../Pods/GameplayPod'
import { GameplayState } from '../States/GameplayState'
import { ScoreUIView } from './ScoreUIView'
import { NextEggSpawnUIView } from './NextEggSpawnUIView'
import { ResultUIView } from './ResultUIView'
import { AudioGameManager } from '../Managers/AudioGameManager'
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

    private startPositionGameplayNode: Vec3

    private gameplayPod: GameplayPod

    public doInit() {
        this.gameplayPod = GameplayPod.instance

        this.startPositionGameplayNode = new Vec3(this.gameplayNode.position)

        this.scoreUIView.doInit()
        this.nextEggSpawnUI.doInit()
        this.resultUIView.doInit()

        this.doOnGameStateChange(this.gameplayPod.gameState)
        this.gameplayPod.gameplayPodEventTarget.on('gameState', (gameState: GameplayState) => {
            this.doOnGameStateChange(gameState)
        })
    }

    public doOnGameStateChange(gameState: GameplayState) {
        this.resultNode.active = gameState == GameplayState.GameResult
        switch (gameState) {
            case GameplayState.GamePlay:
                this.tweenUI(new Vec3(0, -480, 0))
                break
            case GameplayState.GameOver:
                this.tweenUI(this.startPositionGameplayNode)

                this.schedule(() => {
                    this.soundInterval()
                }, 0.1)

                this.scheduleOnce(() => {
                    this.gameplayPod.gameplayPodEventTarget.emit('gameState', GameplayState.GameResult)
                }, 1.5)
                break
            case GameplayState.GameResult:
                this.unscheduleAllCallbacks()
                break
        }
    }

    private soundInterval() {
        AudioGameManager.Instance.playAudio('destroyClip')
    }

    private tweenUI(position: Vec3) {
        tween(this.gameplayNode)
            .to(
                0.4,
                { position: position },
                {
                    easing: 'quartIn',
                }
            )
            .start()
    }

    update(deltaTime: number) {}
}
