import { _decorator, Component, SpriteFrame, resources } from 'cc'
import { SpriteAssetBean } from '../Bean/SpriteAssetBean'
const { ccclass, property } = _decorator

@ccclass('AssetManagerManual')
export class AssetManagerManual extends Component {
    @property([SpriteAssetBean])
    public assetSpriteFrameCache: SpriteAssetBean[] = []

    public static Instance: AssetManagerManual = null

    protected start(): void {
        AssetManagerManual.Instance = this
    }

    public getAsset(key: string): SpriteFrame {
        return this.assetSpriteFrameCache.find((x) => x.key == key).spriteAsset
    }
}
