import { _decorator, AudioClip, AudioSource, Component, instantiate, Node, NodePool } from 'cc'
import { AudioBean } from '../Bean/AudioBean'
const { ccclass, property } = _decorator

@ccclass('AudioGameManager')
export class AudioGameManager extends Component {
    @property([AudioBean])
    public audioBeanCache: AudioBean[] = []

    private pool = new NodePool()

    public static Instance: AudioGameManager = null

    protected start(): void {
        AudioGameManager.Instance = this

        this.initPool()
    }

    private initPool() {
        let initCount = 5
        for (let i = 0; i < initCount; i++) {
            let audioSource = instantiate(new AudioSource())
            audioSource.clip = undefined
            this.pool.put(audioSource.node)
        }
    }

    public playAudio(key: string): number {
        const getAudioSource = this.getFromPool()
        const clip = this.getAudioClip(key)
        getAudioSource.clip = this.getAudioClip(key)
        getAudioSource.play()

        this.scheduleOnce(() => {
            this.pool.put(getAudioSource.node)
        }, clip.getDuration())

        return clip.getDuration()
    }

    public getFromPool(): AudioSource {
        if (this.pool.size() > 0) {
            return this.pool.get().getComponent(AudioSource)
        } else {
            let audioSource = instantiate(new AudioSource())
            return audioSource
        }
    }

    private getAudioClip(key: string): AudioClip {
        return this.audioBeanCache.find((x) => x.key == key).spriteAsset
    }
}
