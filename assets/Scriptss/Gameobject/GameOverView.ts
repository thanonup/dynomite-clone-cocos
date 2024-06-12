import { _decorator, Collider2D, Component, Contact2DType, Graphics, IPhysics2DContact, Node } from 'cc'

const { ccclass, property } = _decorator

@ccclass('GameOverView')
export class GameOverView extends Component {
    @property({
        type: Graphics,
    })
    public gameoverLine: Graphics

    @property({
        type: Collider2D,
    })
    public gameOverColiider: Collider2D

    public doInit() {
        console.log('Init GameOverView')

        this.gameoverLine.rect(-280, 0, 560, 5)
        this.gameoverLine.fill()

        this.gameOverColiider.on(Contact2DType.BEGIN_CONTACT, this.onContact, this)
    }

    private onContact(selfCol: Collider2D, other: Collider2D[], contact: IPhysics2DContact | null) {}

    update(deltaTime: number) {}
}
