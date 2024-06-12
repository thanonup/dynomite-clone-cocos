import { _decorator, Color, Component, Graphics, Node } from 'cc'
const { ccclass, property } = _decorator

@ccclass('EggView')
export class EggView extends Component {
    @property({
        type: Graphics,
    })
    public eggGraphics: Graphics

    start() {
        console.log('create egg')
        this.doInit()
    }

    doInit() {
        this.eggGraphics.circle(0, 0, 25)
        this.eggGraphics.fillColor = new Color('#ff0000')
        this.eggGraphics.fill()
    }

    update(deltaTime: number) {}
}
