'use client'
import { BaseEdge, Edge, EdgeProps, getBezierPath, useReactFlow } from "@xyflow/react";
import { useEffect, useMemo } from "react";

export type AnimatedImageEdge = Edge<{
    node: string,
    dur: number,
    keyframes: any[],
    delay: number,
}, 'animatedImage'>;
const default_data = {
    node: '',
    dur: 2,
    keyframes: [
        {
            offsetDistance: '0%',
            opacity: 1,
            transform: `scale(1)`
        },
        { opacity: 1, },
        { opacity: 1, },
        {
            offsetDistance: '100%',
            opacity: 0,
            transform: `scale(0.4)`,
        }
    ],
    delay: 0,
}
export const AnimatedImageEdge = ({
    id,
    data = { ...default_data },
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
}: EdgeProps<AnimatedImageEdge>) => {
    const { getNode, updateNode } = useReactFlow();
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    const {
        node, dur, keyframes, delay
    } = { ...default_data, ...data }
    const selector = useMemo(() => `.react-flow__node[data-id="${node}"]`, [node])
    useEffect(() => {
        const node_el = document.querySelector(selector) as HTMLElement;
        if (!node_el) return
        node_el.style.offsetPath = `path('${edgePath}')`;
        node_el.style.offsetRotate = '0deg';
        node_el.style.offsetAnchor = 'center';
        node_el.style.transformOrigin = 'center';
        node_el.style.opacity = '0';
        const wasDraggable = getNode(node)?.draggable;
        updateNode(node, { draggable: false });
        return () => {
            node_el.style.offsetPath = 'none';
            updateNode(node, { draggable: wasDraggable })
        }
    }, [selector, edgePath])
    useEffect(() => {
        const node = document.querySelector(selector) as HTMLElement;
        if (!node) return;
        const animation = node.animate(keyframes, {
            duration: dur,
            direction: 'normal',
            iterations: Infinity,
            easing: 'ease-out',
            delay: delay,
        });

        return () => {
            animation.cancel();
        };
    }, [selector]);
    if (!node) return
    return (
        <>
            <BaseEdge id={id} path={edgePath} />
        </>
    );
}
