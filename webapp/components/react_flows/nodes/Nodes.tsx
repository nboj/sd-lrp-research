import { Handle, Position } from "@xyflow/react";
import { memo } from "react";
import Image from 'next/image';
import styles from '@/components/react_flows/nodes/Nodes.module.css';
import { Card, CardBody, CardFooter } from "@nextui-org/react";

const Handles = memo(({ left = 'source', right = 'target', top = 'target', bottom = 'source', disable_left = false, disable_right = false, disable_top = true, disable_bottom = true }: any) => {
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
            {
                !disable_top && (
                    <Handle
                        type={top}
                        position={Position.Top}
                    />
                )
            }
            {
                !disable_bottom && (
                    <Handle
                        type={bottom}
                        position={Position.Bottom}
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
const ImageNode = memo(({ data }: any) => {
    return (
        <Card className={`dark ${styles.image_node}`} style={{ scale: data.scale, ...data.width && { width: data.width }, ...data.height && { height: data.height } }}>
            <CardBody>
                <Image src={data.image} alt='' />
            </CardBody>
            {
                data?.text && (
                    <CardFooter>
                        <p className={styles.text}>{data.text}</p>
                    </CardFooter>
                )
            }
        </Card>
    )
})
ImageNode.displayName = 'ImageNode'
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

export { CircleNode, SquareNode, ImageNode, PixelNode, RGBNode, TitleText, SubtitleText };
