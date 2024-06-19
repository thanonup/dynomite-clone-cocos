import { _decorator, Component, Node } from 'cc'
const { ccclass, property } = _decorator

@ccclass('ScoreUIView')
export class ScoreUIView extends Component {
    public doInit() {
        console.log('Init Score UI View')

        this.node.setSiblingIndex(100000)
    }
    update(deltaTime: number) {}
}
