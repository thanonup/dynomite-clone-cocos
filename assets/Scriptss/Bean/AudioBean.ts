import { _decorator, AudioClip, Component, Node, SpriteFrame } from 'cc'
const { ccclass, property } = _decorator

@ccclass('AudioBean')
export class AudioBean {
    @property({ type: String })
    public key: string = ''

    @property(AudioClip)
    public spriteAsset: AudioClip
}
