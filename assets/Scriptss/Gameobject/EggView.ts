import { _decorator, Collider2D, Color, Component, Contact2DType, Graphics, Node } from 'cc'
const { ccclass, property } = _decorator

@ccclass('EggView')
export class EggView extends Component {
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
        this.eggGraphics.circle(0, 0, 25)
        this.eggGraphics.fillColor = new Color('#ff0000')
        this.eggGraphics.fill()

        this.eggColiider.on(Contact2DType.BEGIN_CONTACT, this.onContact, this)
    }

    private onContact(selfCol: Collider2D, other: Collider2D) {
        console.log('hit')
    }

    update(deltaTime: number) {}
}
