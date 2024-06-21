import { _decorator, Component, Node, Sprite, Tween, tween, Vec3 } from 'cc'
import { GameplayPod } from './Pods/GameplayPod'
import { EggBean } from './Bean/EggBean'
import { AssetManagerManual } from './Managers/AssetManagerManual'
const { ccclass, property } = _decorator

@ccclass('NextEggSpawnUIView')
export class NextEggSpawnUIView extends Component {
    @property(Sprite)
    public eggSprite: Sprite

    private tweenEggNext: Tween<Node>

    private gameplayPod: GameplayPod

    public doInit() {
        console.log('Init Next Egg Spawn UI View')
        this.gameplayPod = GameplayPod.instance

        this.eggSprite.spriteFrame = AssetManagerManual.Instance.getAsset(this.gameplayPod.nextEggSpawnBean.keySprite)

        this.gameplayPod.gameplayPodEventTarget.on('nextEggSpawn', (nextEggBean: EggBean) => {
            this.changeAssetNextEgg(nextEggBean)
        })
    }

    private changeAssetNextEgg(eggBean: EggBean) {
        this.tweenEggNext?.stop()

        this.tweenEggNext = tween(this.eggSprite.node)
            .to(0.15, { scale: new Vec3(0, 0, 0) })
            .call(() => {
                this.eggSprite.spriteFrame = AssetManagerManual.Instance.getAsset(eggBean.keySprite)
            })
            .to(0.1, { scale: new Vec3(1.2, 1.2, 1.2) })
            .to(0.05, { scale: new Vec3(1, 1, 1) })
            .start()
    }

    update(deltaTime: number) {}
}
