'use client'
import { BaseEdge, Edge, EdgeProps, getBezierPath } from "@xyflow/react";

export type AnimatedImageEdge = Edge<{
    image: string,
    width: number,
    height: number,
    offsetX: string,
    offsetY: string,
    dur: number,
    scale: number,
}, 'animatedImage'>;
const default_data = {
    image: null,
    width: 50,
    height: 50,
    offsetX: '-25px',
    offsetY: '-25px',
    dur: 2,
    scale: 1,
}
const AnimatedImageEdge = ({
    id,
    data,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
}: EdgeProps<AnimatedImageEdge>) => {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    const {
        image, width, height, offsetX, offsetY, dur, scale
    } = { ...default_data, ...data }
    if (!image) return
    return (
        <>
            <BaseEdge id={id} path={edgePath} />
            <image href={image} width={width} height={height} className={`origin-left`} style={{ transform: `translate(${offsetX}, ${offsetY}) scale(${scale})` }}>
                <animateMotion path={edgePath} repeatCount={'indefinite'} dur={dur} />
            </image>
        </>
    );
}

export default AnimatedImageEdge;
