'use client'
import { Asset, AssetType, FullGeneration, FullIteration } from "@/lib/types";
import LRPText from '@/components/lrp_text/LRPText'
import { getRelevanceColor, parseRelevanceScores, parseStringArray } from "@/lib/utils";
import NextImage from 'next/image'
import styles from '@/components/generation/generation/Generation.module.css'
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Slider } from "@nextui-org/react";
import { FaPlay, FaPause } from "react-icons/fa6";
import { PiFastForwardBold, PiFastForwardFill } from "react-icons/pi";
import { Bar, Tooltip, BarChart, Customized, Rectangle, ReferenceLine, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";

type AssetImapeProps = Readonly<{
    pathname: string;
    onLoad: any;
    style?: any;
}>
const AssetImage = ({ pathname, onLoad, style }: AssetImapeProps) => {
    return (
        <div className={styles.asset_image}>
            <NextImage loading='eager' src={pathname} alt="" fill onLoad={onLoad} sizes="500px" style={{ ...style }} />
        </div>
    )
}

function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number, exponent: number = 1) {
    let normalized = (value - inMin) / (inMax - inMin);
    normalized = Math.pow(normalized, exponent);
    return normalized * (outMax - outMin) + outMin;
}
const MAX_DELAY = 1000
const MIN_DELAY = 100
type Props = Readonly<{
    generation: FullGeneration;
}>
type IterationSet = {
    lrp: Asset;
    noise: Asset;
    noise_pred: Asset;
    text_rel: number[];
    chart_data: any;
    domain: number[];
}
const Generation = ({ generation }: Props) => {
    const [index, setIndex] = useState<number>(0);
    const [assets, setAssets] = useState<IterationSet[]>([]);
    const [animating, setAnimating] = useState<boolean>(false);
    const [delay, setDelay] = useState<number>(300);
    const start_time = useRef<number>(Date.now())
    const current_animation_frame = useRef<number>(0)
    const average = useMemo(() => {
        const final: any = generation.iterations.reduce((accumulator: any, b: FullIteration) => {
            const rels = b.assets.find((item: Asset) => item.asset_type === AssetType.TEXT_SCORES)
            if (accumulator.length != null) {
                return parseRelevanceScores(rels?.text_relevance[0]).map((item: number, index: number) => item + accumulator[index])
            } else {
                return parseRelevanceScores(rels?.text_relevance[0])
            }
        })
        const text = parseStringArray(generation.generation.prompt[0])
        const final_data = final.map((item: number, index: number) => ({
            name: text[index],
            value: item / generation.iterations.length
        }))
        const max = Math.ceil(final_data.reduce((a: any, b: any) => isNaN(a) ? Math.max(Math.abs(a.value), Math.abs(b.value)) : Math.max(Math.abs(a), Math.abs(b.value))) * 1000) / 1000
        const scores = final_data.map((item: any) => item.value)
        return {
            final: final_data,
            scores: scores,
            domain: [-max, max]
        }
    }, [])

    const [loaded, setLoaded] = useState<boolean>(false);
    const load_count = useRef<number>(0)

    const handleLoad = useCallback(() => {
        load_count.current++
        if (!loaded && load_count.current >= generation.iterations.length * 3) {
            setAnimating(true)
            setLoaded(true)
        }
    }, [loaded, generation])
    const handleToggleAnimation = useCallback(() => {
        setAnimating(prev => !prev)
    }, [setAnimating])
    const startRender = useCallback(() => {
        const render = () => {
            const now = Date.now();
            if (now - start_time.current > delay) {
                start_time.current = now;
                setIndex((prev: number) => {
                    const max = generation.iterations.length
                    const next = (prev + 1) % max
                    return next
                })
            }
            current_animation_frame.current = requestAnimationFrame(render)
        }
        current_animation_frame.current = requestAnimationFrame(render)
    }, [delay, generation])
    const generateAssets = useCallback(() => {
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

            const text_arr = parseStringArray(generation.generation.prompt[0])
            const text_rel = parseRelevanceScores(text.text_relevance[0])
            const chart_data = text_arr.map((text: string, index: number) => ({
                name: text,
                value: text_rel[index],
            }))
            const max = Math.ceil(text_rel.reduce((a: number, b: number) => Math.max(Math.abs(a), Math.abs(b))) * 1000) / 1000

            temp_assets.push({ lrp, noise, noise_pred, text_rel, chart_data, domain: [-max, max] });
        }
        setAssets([...temp_assets])
    }, [generation])
    const getDelay = useCallback((delay: number) => MAX_DELAY - delay + MIN_DELAY, [])
    const handleSpeedChange = useCallback((e: number | number[]) => {
        setDelay(getDelay(mapRange(Number(e), 0, 100, MIN_DELAY, MAX_DELAY, .25)))
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
                                <div className={styles.display_container} key={`${iteration.lrp.id}-iteration`} style={!loaded ? { position: "absolute", top: 0, left: 0, opacity: "0" } : {}} >
                                    <AssetImage pathname={iteration.lrp.pathname} onLoad={handleLoad} style={{ borderRadius: "16px 0 0 16px" }} />
                                    <AssetImage pathname={iteration.noise.pathname} onLoad={handleLoad} />
                                    <AssetImage pathname={iteration.noise_pred.pathname} onLoad={handleLoad} style={{ borderRadius: "0 16px 16px 0" }} />
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
            <div className={styles.controls_container}>
                <Slider
                    label="Iteration"
                    step={1}
                    maxValue={generation.iterations.length - 1}
                    minValue={0}
                    value={index}
                    getValue={(value) => `${Number(value) + 1}`}
                    size={'lg'}
                    showSteps
                    className={styles.iteration_slider}
                    classNames={{ label: styles.iteration_label, value: styles.iteration_value }}
                    onChange={(value) => {
                        setIndex(value as number)
                        setAnimating(false)
                    }}
                />
                <div className={styles.controls_row}>
                    <span></span>
                    {
                        animating ? (
                            <FaPause className={styles.control_button} onClick={handleToggleAnimation} />
                        ) : (
                            <FaPlay className={styles.control_button} onClick={handleToggleAnimation} />
                        )
                    }
                    <Slider
                        aria-label="Speed"
                        startContent={<PiFastForwardBold className={styles.slow_control} />}
                        endContent={<PiFastForwardFill className={styles.fast_control} />}
                        step={1}
                        size="sm"
                        minValue={0}
                        maxValue={100}
                        value={mapRange(getDelay(delay), MIN_DELAY, MAX_DELAY, 0, 100, 4)}
                        onChange={handleSpeedChange}
                        className={styles.speed_slider}
                    />
                </div>
            </div>
            <div className={styles.charts_container}>
                {
                    assets.length > 0 && index < assets.length ? (
                        <div>
                            <div className={styles.lrp_header}>
                                <p className={styles.lrp_label}>Iteration {index}:</p>
                                <LRPText className={styles.lrp_text} generation={generation.generation} values={assets[index].text_rel} min={assets[index].domain[0]} max={assets[index].domain[1]} />
                            </div>
                            <ResponsiveContainer height={500} width={"100%"}>
                                <BarChart data={assets[index].chart_data} height={500}>
                                    <XAxis dataKey={'name'} />
                                    <YAxis dataKey={'value'} domain={assets[index].domain} />
                                    <Tooltip wrapperClassName={styles.tooltip_wrapper} />
                                    <ReferenceLine y={0} stroke="var(--secondary)" />
                                    <Bar
                                        animationDuration={100}
                                        className={styles.bar}
                                        maxBarSize={100}
                                        dataKey={'value'}
                                        fill={'white'}
                                        shape={({ x, y, width, height, value }: any) => {
                                            return (
                                                <Rectangle
                                                    x={x}
                                                    y={y}
                                                    width={width}
                                                    height={height}
                                                    fill={getRelevanceColor(value, assets[index].domain[0], assets[index].domain[1])}
                                                />
                                            );
                                        }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )
                }
                <div>
                    <div className={styles.lrp_header}>
                        <p className={styles.lrp_label}>Average:</p>
                        <LRPText className={styles.lrp_text} generation={generation.generation} values={average.scores} min={average.domain[0]} max={average.domain[1]} />
                    </div>
                    <ResponsiveContainer height={500} width={"100%"}>
                        <BarChart data={average.final} height={500}>
                            <XAxis dataKey={'name'} />
                            <YAxis dataKey={'value'} domain={average.domain} />
                            <Tooltip wrapperClassName={styles.tooltip_wrapper} />
                            <ReferenceLine y={0} stroke="var(--secondary)" />
                            <Bar
                                className={styles.bar}
                                maxBarSize={100}
                                dataKey={'value'}
                                fill={'white'}
                                shape={({ x, y, width, height, value }: any) => {
                                    return (
                                        <Rectangle
                                            x={x}
                                            y={y}
                                            width={width}
                                            height={height}
                                            fill={getRelevanceColor(value, average.domain[0], average.domain[1])}
                                        />
                                    );
                                }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default Generation
