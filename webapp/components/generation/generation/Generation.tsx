'use client'
import { Asset, AssetType, FullGeneration } from "@/lib/types";
import LRPText from '@/components/lrp_text/LRPText'
import { getRelevanceColor, parseRelevanceScores, parseStringArray } from "@/lib/utils";
import NextImage from 'next/image'
import styles from '@/components/generation/generation/Generation.module.css'
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Slider } from "@nextui-org/react";
import { FaPlay, FaPause } from "react-icons/fa6";
import { PiFastForwardBold, PiFastForwardFill } from "react-icons/pi";
import { Bar, Tooltip, BarChart, Rectangle, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";

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
    lrp1: Asset;
    lrp2: Asset;
    noise: Asset;
    noise_pred: Asset;
    text_key_rel: number[];
    text_value_rel: number[];
    chart_data1: any;
    chart_data2: any;
    domain1: number[];
    domain2: number[];
}
const Generation = ({ generation }: Props) => {
    const [index, setIndex] = useState<number>(0);
    const [assets, setAssets] = useState<IterationSet[]>([]);
    const [animating, setAnimating] = useState<boolean>(false);
    const [delay, setDelay] = useState<number>(300);
    const start_time = useRef<number>(Date.now())
    const current_animation_frame = useRef<number>(0)
    const average1 = useMemo(() => {
        if (generation.iterations.length === 0) return { final: [], scores: [], domain: [-100, 100] };

        // Initialize accumulator as an array of zeros
        const numScores = parseRelevanceScores(generation.iterations[0].assets.find(
            (item: Asset) => item.asset_type === AssetType.TEXT_VALUE_SCORES
        )?.text_relevance[0])?.length ?? 0;

        const summedScores = new Array(numScores).fill(0);

        // Sum all scores
        for (const iteration of generation.iterations) {
            const rels = iteration.assets.find(item => item.asset_type === AssetType.TEXT_VALUE_SCORES);
            if (!rels) continue;
            const scores = parseRelevanceScores(rels.text_relevance[0]) ?? [];
            for (let i = 0; i < scores.length; i++) {
                summedScores[i] += scores[i];
            }
        }

        // Compute the average
        const averagedScores = summedScores.map(sum => sum / generation.iterations.length);

        // Extract prompt words
        const text = parseStringArray(generation.generation.prompt[0]);

        // Format data
        const final_data = averagedScores.map((item, index) => ({
            name: text[index] ?? `Unknown ${index}`,
            value: item
        }));

        // Compute min/max for normalization
        const maxScore = Math.max(...averagedScores);
        const minScore = Math.min(...averagedScores);

        // Normalize values between -100 and 100
        for (let i = 0; i < final_data.length; i++) {
            final_data[i].value = mapRange(final_data[i].value, minScore, maxScore, -100, 100);
        }

        return {
            final: final_data,
            scores: final_data.map(item => item.value),
            domain: [-100, 100]
        };
    }, [generation]);

    const average2 = useMemo(() => {
        if (generation.iterations.length === 0) return { final: [], scores: [], domain: [-100, 100] };

        // Initialize accumulator as an array of zeros
        const numScores = parseRelevanceScores(generation.iterations[0].assets.find(
            (item: Asset) => item.asset_type === AssetType.TEXT_KEY_SCORES
        )?.text_relevance[0])?.length ?? 0;

        const summedScores = new Array(numScores).fill(0);

        // Sum all scores
        for (const iteration of generation.iterations) {
            const rels = iteration.assets.find(item => item.asset_type === AssetType.TEXT_KEY_SCORES);
            if (!rels) continue;
            const scores = parseRelevanceScores(rels.text_relevance[0]) ?? [];
            for (let i = 0; i < scores.length; i++) {
                summedScores[i] += scores[i];
            }
        }

        // Compute the average
        const averagedScores = summedScores.map(sum => sum / generation.iterations.length);

        // Extract prompt words
        const text = parseStringArray(generation.generation.prompt[0]);

        // Format data
        const final_data = averagedScores.map((item, index) => ({
            name: text[index] ?? `Unknown ${index}`,
            value: item
        }));

        // Compute min/max for normalization
        const maxScore = Math.max(...averagedScores);
        const minScore = Math.min(...averagedScores);

        // Normalize values between -100 and 100
        for (let i = 0; i < final_data.length; i++) {
            final_data[i].value = mapRange(final_data[i].value, minScore, maxScore, -100, 100);
        }

        return {
            final: final_data,
            scores: final_data.map(item => item.value),
            domain: [-100, 100]
        };
    }, [generation]);

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

            const lrp_asset1 = iteration.assets.find(asset => asset.asset_type === AssetType.NOISE_LRP1)
            const lrp_asset2 = iteration.assets.find(asset => asset.asset_type === AssetType.NOISE_LRP2)
            const noise_asset = iteration.assets.find(asset => asset.asset_type === AssetType.NOISE)
            const noise_pred_asset = iteration.assets.find(asset => asset.asset_type === AssetType.NOISE_PRED)
            const text_value = iteration.assets.find(asset => asset.asset_type === AssetType.TEXT_VALUE_SCORES)
            const text_key = iteration.assets.find(asset => asset.asset_type === AssetType.TEXT_KEY_SCORES)
            if (!lrp_asset1 || !lrp_asset2 || !noise_asset || !text_value || !text_key || !noise_pred_asset) throw Error("Cannot find asset")
            const lrp1 = lrp_asset1
            const lrp2 = lrp_asset2
            const noise = noise_asset
            const noise_pred = noise_pred_asset

            const text_arr = parseStringArray(generation.generation.prompt[0])
            const text_value_rel = parseRelevanceScores(text_value.text_relevance[0])
            const text_key_rel = parseRelevanceScores(text_key.text_relevance[0])
            const max1 = Math.ceil(text_value_rel.reduce((a: number, b: number) => Math.max(Math.abs(a), Math.abs(b))) * 1000) / 1000
            for (let i = 0; i < text_value_rel.length; i++) {
                text_value_rel[i] = mapRange(text_value_rel[i], -max1, max1, -100, 100);
            }
            const max2 = Math.ceil(text_key_rel.reduce((a: number, b: number) => Math.max(Math.abs(a), Math.abs(b))) * 1000) / 1000
            for (let i = 0; i < text_key_rel.length; i++) {
                text_key_rel[i] = mapRange(text_key_rel[i], -max2, max2, -100, 100);
            }

            const chart_data1 = text_arr.map((text: string, index: number) => ({
                name: text,
                value: text_value_rel[index],
            }))
            const chart_data2 = text_arr.map((text: string, index: number) => ({
                name: text,
                value: text_key_rel[index],
            }))
            temp_assets.push({ lrp1, lrp2, noise, noise_pred, text_value_rel, text_key_rel, chart_data1, chart_data2, domain1: [-100, 100], domain2: [-100, 100] });
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
            <div className={styles.labels_container}>
                <h2>LRP</h2>
                <h2>LOG LRP</h2>
                <h2>NOISE</h2>
                <h2>PRED NOISE</h2>
            </div>
            {
                assets.length > 0 && index < assets.length ? (
                    <>
                        {!loaded && <p>Loading...</p>}
                        {
                            assets.map((iteration: IterationSet, idx: number) => (idx == index || !loaded) && (
                                <div className={styles.display_container} key={`${iteration.lrp1.id}-iteration`} style={!loaded ? { position: "absolute", top: 0, left: 0, opacity: "0" } : {}} >
                                    <AssetImage pathname={iteration.lrp1.pathname} onLoad={handleLoad} style={{ borderRadius: "16px 0 0 16px" }} />
                                    <AssetImage pathname={iteration.lrp2.pathname} onLoad={handleLoad} />
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
                <div className={styles.chart_container}>
                    {
                        assets.length > 0 && index < assets.length ? (
                            <div>
                                <div className={styles.lrp_header}>
                                    <p className={styles.lrp_label}>Values for Iteration {index}:</p>
                                    <LRPText className={styles.lrp_text} generation={generation.generation} values={assets[index].text_value_rel} min={assets[index].domain1[0]} max={assets[index].domain1[1]} />
                                </div>
                                <ResponsiveContainer height={500} width={"100%"}>
                                    <BarChart data={assets[index].chart_data1} height={500}>
                                        <XAxis dataKey={'name'} />
                                        <YAxis dataKey={'value'} domain={assets[index].domain1} />
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
                                                        fill={getRelevanceColor(value, assets[index].domain1[0], assets[index].domain1[1])}
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
                    {
                        assets.length > 0 && index < assets.length ? (
                            <div>
                                <div className={styles.lrp_header}>
                                    <p className={styles.lrp_label}>Keys for Iteration {index}:</p>
                                    <LRPText className={styles.lrp_text} generation={generation.generation} values={assets[index].text_key_rel} min={assets[index].domain2[0]} max={assets[index].domain2[1]} />
                                </div>
                                <ResponsiveContainer height={500} width={"100%"}>
                                    <BarChart data={assets[index].chart_data2} height={500}>
                                        <XAxis dataKey={'name'} />
                                        <YAxis dataKey={'value'} domain={assets[index].domain2} />
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
                                                        fill={getRelevanceColor(value, assets[index].domain2[0], assets[index].domain2[1])}
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
                </div>
                <div className={styles.chart_container}>
                    <div>
                        <div className={styles.lrp_header}>
                            <p className={styles.lrp_label}>Average Values:</p>
                            <LRPText className={styles.lrp_text} generation={generation.generation} values={average1.scores} min={average1.domain[0]} max={average1.domain[1]} />
                        </div>
                        <ResponsiveContainer height={500} width={"100%"}>
                            <BarChart data={average1.final} height={500}>
                                <XAxis dataKey={'name'} />
                                <YAxis dataKey={'value'} domain={average1.domain} />
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
                                                fill={getRelevanceColor(value, average1.domain[0], average1.domain[1])}
                                            />
                                        );
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <div className={styles.lrp_header}>
                            <p className={styles.lrp_label}>Average Keys:</p>
                            <LRPText className={styles.lrp_text} generation={generation.generation} values={average2.scores} min={average2.domain[0]} max={average2.domain[1]} />
                        </div>
                        <ResponsiveContainer height={500} width={"100%"}>
                            <BarChart data={average2.final} height={500}>
                                <XAxis dataKey={'name'} />
                                <YAxis dataKey={'value'} domain={average2.domain} />
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
                                                fill={getRelevanceColor(value, average2.domain[0], average2.domain[1])}
                                            />
                                        );
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Generation
