import {
    _decorator,
    Collider2D,
    Component,
    Contact2DType,
    EventTarget,
    Graphics,
    IPhysics2DContact,
    Node,
    UITransform,
} from 'cc'
import { GameplayPod } from '../Pods/GameplayPod'
import { GameplayState } from '../States/GameplayState'

const { ccclass, property } = _decorator

@ccclass('GameOverView')
export class GameOverView extends Component {
    @property({
        type: Graphics,
    })
    public gameoverLine: Graphics

    private gameplayPod: GameplayPod

    @property({
        type: Collider2D,
    })
    public gameOverColiider: Collider2D

    public doInit() {
        console.log('Init GameOverView')
        this.gameplayPod = GameplayPod.instance

        this.gameoverLine.rect(
            -this.node.getComponent(UITransform).width / 2,
            0,
            this.node.getComponent(UITransform).width,
            5
        )
        this.gameoverLine.fill()
    }

    update(deltaTime: number) {}
}
