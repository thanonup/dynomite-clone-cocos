import { _decorator, Component, Node, Sprite, tween, Vec3 } from 'cc'
import { GameplayPod } from './Pods/GameplayPod'
import { EggBean } from './Bean/EggBean'
import { AssetManagerManual } from './Managers/AssetManagerManual'
const { ccclass, property } = _decorator

@ccclass('NextEggSpawnUIView')
export class NextEggSpawnUIView extends Component {
    @property(Sprite)
    public eggSprite: Sprite

    private gameplayPod: GameplayPod

    public doInit() {
        console.log('Init Next Egg Spawn UI View')
        this.gameplayPod = GameplayPod.instance
        this.eggSprite.node.scale = new Vec3()
        this.changeAssetNextEgg(this.gameplayPod.nextEggSpawnBean)
        this.gameplayPod.gameplayPodEventTarget.on('nextEggSpawn', (nextEggBean: EggBean) => {
            console.log('update egg next')
            this.changeAssetNextEgg(nextEggBean)
        })
    }

    private changeAssetNextEgg(eggBean: EggBean) {
        // tween(this.eggSprite.node)
        this.eggSprite.spriteFrame = AssetManagerManual.Instance.getAsset(eggBean.keySprite)
    }

    update(deltaTime: number) {}
}
