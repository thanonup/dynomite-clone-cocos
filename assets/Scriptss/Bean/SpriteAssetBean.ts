import { _decorator, Component, Node, SpriteFrame } from 'cc'
const { ccclass, property } = _decorator

@ccclass('SpriteAssetBean')
export class SpriteAssetBean {
    @property({ type: String })
    public key: string = ''

    @property(SpriteFrame)
    public spriteAsset: SpriteFrame
}
