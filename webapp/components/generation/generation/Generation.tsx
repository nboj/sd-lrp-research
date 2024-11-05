'use client'
import { Asset, AssetType, FullGeneration } from "@/lib/types";
import LRPText from '@/components/lrp_text/LRPText'
import { parseRelevanceScores } from "@/lib/utils";
import NextImage from 'next/image'
import styles from '@/components/generation/generation/Generation.module.css'
import { useCallback, useEffect, useRef, useState } from "react";
import { Slider } from "@nextui-org/react";
import { FaPlay, FaPause } from "react-icons/fa6";

type AssetImapeProps = Readonly<{
    pathname: string;
    loaded: boolean;
    onLoad: any;
}>
const AssetImage = ({ pathname, loaded, onLoad }: AssetImapeProps) => {
    return (
        <NextImage loading='eager' src={pathname} alt="" width={200} height={200} onLoad={onLoad} style={{ position: loaded ? "relative" : "absolute", opacity: loaded ? "1" : "0" }} />
    )
}

const DELAY = 100;
type Props = Readonly<{
    generation: FullGeneration;
}>
type IterationSet = {
    lrp: Asset;
    noise: Asset;
    noise_pred: Asset;
    text: Asset;
}
const Generation = ({ generation }: Props) => {
    const [index, setIndex] = useState<number>(0);
    const [assets, setAssets] = useState<IterationSet[]>([]);
    const [animating, setAnimating] = useState<boolean>(true);
    const current_animation_frame = useRef<number>(0)

    const [loaded, setLoaded] = useState<boolean>(false);
    const load_count = useRef<number>(0)

    const handleLoad = useCallback(() => {
        load_count.current++
        if (!loaded && load_count.current >= generation.iterations.length * 3) {
            setLoaded(true)
        }
    }, [loaded])
    const handleToggleAnimation = useCallback(() => {
        setAnimating(prev => !prev)
    }, [setAnimating])
    const startRender = useCallback(() => {
        let start_time = Date.now();
        const render = () => {
            const now = Date.now();
            if (now - start_time > DELAY) {
                start_time = now;
                setIndex((prev: number) => {
                    const max = generation.iterations.length
                    const next = (prev + 1) % max
                    return next
                })
            }
            current_animation_frame.current = requestAnimationFrame(render)
        }
        current_animation_frame.current = requestAnimationFrame(render)
    }, [])
    const generateAssets = useCallback(async () => {
        const temp_assets = []
        for (let i = 0; i < generation.iterations.length; i++) {
            const iteration = generation.iterations[i]

            const lrp_asset = iteration.assets.find(asset => asset.asset_type === AssetType.NOISE_LRP)
            const noise_asset = iteration.assets.find(asset => asset.asset_type === AssetType.NOISE)
            const noise_pred_asset = iteration.assets.find(asset => asset.asset_type === AssetType.NOISE_PRED)
            const text = iteration.assets.find(asset => asset.asset_type === AssetType.TEXT_SCORES)
            if (!lrp_asset || !noise_asset || !text || !noise_pred_asset) throw Error("Cannot find asset")
            const lrp = lrp_asset
            const noise = noise_asset
            const noise_pred = noise_pred_asset

            temp_assets.push({ lrp, noise, noise_pred, text });
        }
        setAssets([...temp_assets])
    }, [])
    useEffect(() => {
        if (animating) {
            startRender()
        }
        return () => cancelAnimationFrame(current_animation_frame.current)
    }, [startRender, animating])
    useEffect(() => {
        generateAssets()
    }, [generateAssets])
    return (
        <div className={styles.wrapper}>
            {
                assets.length > 0 && index < assets.length ? (
                    <>
                        {!loaded && <p>Loading...</p>}
                        {
                            assets.map((iteration: IterationSet, idx: number) => (idx == index || !loaded) && (
                                <div className={styles.display_container} key={`${iteration.lrp.id}-iteration`}>
                                    <AssetImage pathname={iteration.lrp.pathname} loaded={loaded} onLoad={handleLoad} />
                                    <AssetImage pathname={iteration.noise_pred.pathname} loaded={loaded} onLoad={handleLoad} />
                                    <AssetImage pathname={iteration.noise.pathname} loaded={loaded} onLoad={handleLoad} />
                                </div>
                            ))
                        }
                    </>
                ) : (
                    <>
                        <p>Loading...</p>
                    </>
                )
            }
            {
                assets.length > 0 && index < assets.length ? (
                    <LRPText generation={generation.generation} values={parseRelevanceScores(assets[index].text.text_relevance[0])} />
                ) : (
                    <>
                        <p>Loading...</p>
                    </>
                )
            }
            <Slider
                label="Animation Step"
                step={1}
                maxValue={generation.iterations.length - 1}
                minValue={0}
                value={index}
                getValue={(value) => `Step ${Number(value) + 1}`}
                showSteps
                className={styles.slider}
                onChange={(value) => {
                    setIndex(value as number)
                    setAnimating(false)
                }}
            />
            {
                animating ? (
                    <FaPause className={styles.control_button} onClick={handleToggleAnimation} />
                ) : (
                    <FaPlay className={styles.control_button} onClick={handleToggleAnimation} />
                )
            }
        </div>
    )
}

export default Generation
