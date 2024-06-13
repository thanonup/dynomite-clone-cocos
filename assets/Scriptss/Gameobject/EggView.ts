import { _decorator, Collider2D, Color, Component, Contact2DType, Graphics, IPhysics2DContact, Node } from 'cc'
import { GameplayPod } from '../Pods/GameplayPod'
import { GameplayState } from '../States/GameplayState'
const { ccclass, property } = _decorator

@ccclass('EggView')
export class EggView extends Component {
    private gamePlayPod: GameplayPod

    @property({
        type: Graphics,
    })
    public eggGraphics: Graphics

    @property({
        type: Collider2D,
    })
    public eggColiider: Collider2D

    start() {
        console.log('create egg')
        this.doInit()
    }

    doInit() {
        this.gamePlayPod = GameplayPod.instance

        this.eggGraphics.circle(0, 0, 25)
        this.eggGraphics.fillColor = new Color('#ff0000')
        this.eggGraphics.fill()

        this.eggColiider.on(Contact2DType.BEGIN_CONTACT, this.onContact, this)
    }

    private onContact(selfCol: Collider2D, other: Collider2D, contact: IPhysics2DContact | null) {
        console.log('hit : ' + other.tag)
        this.gamePlayPod.gameStateEventTarget.emit('gameState', GameplayState.GameOver)
    }

    update(deltaTime: number) {}
}
