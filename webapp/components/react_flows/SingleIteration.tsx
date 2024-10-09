'use client'
import { Background, Handle, Position, ReactFlow, Controls } from "@xyflow/react"
import styles from '@/components/react_flows/SingleIteration.module.css'
import { memo } from "react"

const Handles = memo(({ left = 'source', right = 'target', disable_left = false, disable_right = false }: any) => {
    return (
        <>
            {
                !disable_right && (
                    <Handle
                        type={right}
                        position={Position.Right}
                    />
                )
            }
            {
                !disable_left && (
                    <Handle
                        type={left}
                        position={Position.Left}
                    />
                )
            }
        </>
    )
})
Handles.displayName = 'Handles'

const CircleNode = memo(({ data }: any) => {
    return (
        <div className={styles.circle_node}>
            <Handles {...data} />
            <h2>{data.name}</h2>
        </div>
    )
})
CircleNode.displayName = 'CircleNode'
const SquareNode = memo(({ data }: any) => {
    return (
        <div className={styles.square_node}>
            <h2>{data.name}</h2>
            <Handles {...data} />
        </div>
    )
})
SquareNode.displayName = 'SquareNode'
const PixelNode = memo(({ data }: any) => {
    return (
        <div className={styles.pixel_node} style={{ background: data.color }}>
            {data.name}
            <Handles {...data} />
        </div>
    )
})
PixelNode.displayName = 'PixelNode'
const RGBNode = memo(({ data }: any) => {
    return (
        <div className={styles.rgb_node}>
            <Handles {...data} />
        </div>
    )
})
RGBNode.displayName = 'RGBNode'
const TitleText = memo(({ data }: any) => {
    return (
        <div className={styles.title}>
            <h1>{data.name}</h1>
            <Handles disable_left disable_right />
        </div>
    )
})
TitleText.displayName = 'TitleText'
const SubtitleText = memo(({ data }: any) => {
    return (
        <div className={styles.subtitle}>
            <h2>{data.name}</h2>
            <Handles disable_left disable_right />
        </div>
    )
})
SubtitleText.displayName = 'SubtitleText'

const node_types = {
    square: SquareNode,
    circle: CircleNode,
    rgb: RGBNode,
    pixel: PixelNode,
    title: TitleText,
    subtitle: SubtitleText,
}
let i = 0;
const incXPos = (factor: number = 350) => {
    return ++i * factor;
}
const getXPos = (factor: number = 350) => {
    return i * factor;
}
const initial_nodes = [
    {
        id: 'prev_pred_noise',
        type: 'circle',
        data: {
            name: "Previous Pred Noise",
            disable_left: true,
        },
        position: { x: getXPos(), y: 250 }
    },
    {
        id: 'latents',
        type: 'square',
        data: {
            name: "Latent Noisy Image Input Relevance Scores",
            disable_left: true,
            disable_right: true,
        },
        position: { x: incXPos(), y: 0 }
    },
    {
        id: 'rgb',
        type: 'rgb',
        data: {
            disable_right: true,
        },
        position: { x: getXPos() + 30, y: 100 }
    },
    {
        id: 'pixel-1',
        type: 'pixel',
        data: {
            color: '#4D527D',
            name: "B",
            disable_left: true,
        },
        position: { x: 60, y: 280 },
        parentId: 'rgb',
    },
    {
        id: 'pixel-2',
        type: 'pixel',
        data: {
            color: '#4D7D5B',
            name: "G",
            disable_left: true,
        },
        position: { x: 60, y: 160 },
        parentId: 'rgb',
    },
    {
        id: 'pixel-3',
        type: 'pixel',
        data: {
            color: '#7D4D4D',
            name: "R",
            disable_left: true,
        },
        position: { x: 60, y: 40 },
        parentId: 'rgb',
    },


    {
        id: 'title',
        type: 'title',
        data: {
            name: "For a single iteration",
        },
        position: { x: incXPos() - 100, y: -150 }
    },


    {
        id: 'text_embeds',
        type: 'square',
        data: {
            name: "Text Embeddings Relevance Scores",
            disable_left: true,
        },
        position: { x: getXPos(), y: 0 }
    },
    {
        id: 'time_embeds',
        type: 'square',
        data: {
            name: "Time Embeddings Relevance Scores",
            disable_left: true,
        },
        position: { x: getXPos(), y: 450 }
    },
    {
        id: 'unet',
        type: 'square',
        data: {
            name: "Unet"
        },
        position: { x: incXPos(), y: 200 }
    },
    {
        id: 'pred_noise',
        type: 'circle',
        data: {
            name: "Pred Noise",
            disable_right: true,
        },
        position: { x: incXPos(), y: 150 }
    },
]
const initial_edges = [
    { id: "e1-1", animated: true, source: "pred_noise", target: 'unet' },
    { id: "e2-1", animated: true, source: "unet", target: 'text_embeds' },
    { id: "e2-2", animated: true, source: "unet", target: 'time_embeds' },

    { id: "e3-1", animated: true, source: "rgb", target: 'prev_pred_noise' },

    { id: "epixel-1", animated: true, source: "unet", target: 'pixel-1' },
    { id: "epixel-2", animated: true, source: "unet", target: 'pixel-2' },
    { id: "epixel-3", animated: true, source: "unet", target: 'pixel-3' },
]
const SingleIteration = () => {
    return (
        <div className={styles.wrapper}>
            <ReactFlow
                nodeTypes={node_types}
                nodes={initial_nodes}
                edges={initial_edges}
                fitView
                nodesDraggable={false}
                zoomOnScroll={false}
                nodesConnectable={false}
                elementsSelectable={false}
            >
                <Background />
                <Controls
                    showInteractive={false}
                    showZoom={false}
                    className={styles.controls}
                />
            </ReactFlow>
        </div>
    )
}

export default SingleIteration;
