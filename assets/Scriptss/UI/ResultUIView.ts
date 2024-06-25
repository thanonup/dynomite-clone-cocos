import { _decorator, Button, Component, EventHandler, Label, Node } from 'cc'
import { GameplayPod } from '../Pods/GameplayPod'
import { GameplayState } from '../States/GameplayState'
const { ccclass, property } = _decorator

@ccclass('ResultUIView')
export class ResultUIView extends Component {
    @property(Label)
    public scoreText: Label
    @property(Button)
    public restartButton: Button

    private gameplayPod: GameplayPod

    public doInit() {
        console.log('Init ResultUI View')

        this.gameplayPod = GameplayPod.instance
    }

    public buttonCallBack() {
        this.gameplayPod.gameplayPodEventTarget.emit('gameState', GameplayState.PreStart)
    }

    protected onEnable(): void {
        if (this.gameplayPod) {
            this.scoreText.string = this.gameplayPod.score?.toString()
        }
    }

    update(deltaTime: number) {}
}
