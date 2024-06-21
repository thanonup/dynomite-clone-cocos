import { _decorator, Component, Label, Node } from 'cc'
import { GameplayPod } from '../Pods/GameplayPod'
const { ccclass, property } = _decorator

@ccclass('ScoreUIView')
export class ScoreUIView extends Component {
    @property({ type: Label })
    private scoreText: Label

    private gameplayPod: GameplayPod

    public doInit() {
        console.log('Init Score UI View')
        this.gameplayPod = GameplayPod.instance

        this.updateScore(this.gameplayPod.score)
        this.gameplayPod.gameplayPodEventTarget.on('score', (score: number) => {
            this.updateScore(score)
        })
    }

    private updateScore(score: number) {
        this.scoreText.string = `Score : ${score}`
    }

    update(deltaTime: number) {}
}
