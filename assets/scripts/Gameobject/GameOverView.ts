import { _decorator, Component, Graphics, Node } from 'cc'
const { ccclass, property } = _decorator

@ccclass('GameOverView')
export class GameOverView extends Component {
    @property({
        type: Graphics,
    })
    public gameoverLine: Graphics

    public doInit() {
        console.log('Init GameOverView')

        this.gameoverLine.rect(-280, 0, 560, 5)
        this.gameoverLine.fill()
    }

    update(deltaTime: number) {}
}
