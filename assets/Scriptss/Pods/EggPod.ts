import { _decorator, Component, Node } from 'cc'
import { EggView } from '../Gameobject/EggView'
import { EggBean } from '../Bean/EggBean'
const { ccclass, property } = _decorator

@ccclass('EggPod')
export class EggPod extends Component {
    public eggList: Array<EggView> = new Array<EggView>()
    public bean: EggBean
}
