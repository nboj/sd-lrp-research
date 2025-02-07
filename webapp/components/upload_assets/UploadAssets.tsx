'use client'
import { useActionState, useState } from 'react'
import Image from 'next/image'
import { upload } from '@/actions/file_actions'
import { useFormStatus } from 'react-dom'

type Props = Readonly<{
    label: string;
}>
const Collection = ({ label }: Props) => {
    const [noiseFiles, setNoiseFiles] = useState<File[]>([])
    const handleNoiseFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        setNoiseFiles([])
        if (files) {
            for (let i = 0; i < files.length; i++) {
                setNoiseFiles((old: File[]) => [...old, files[i]])
            }
        }
    };
    return (
        <div>
            <label htmlFor={`${label}`}>Choose {label} images to upload</label>
            <input type='file' name={`${label}`} onChange={handleNoiseFileChange} multiple />
            <div className='flex w-full flex-wrap'>
                {
                    noiseFiles && noiseFiles.map((file: File, index: number) => {
                        return (
                            <Image alt='' key={`file-${index}`} src={URL.createObjectURL(file)} width={100} height={100} />
                        )
                    })
                }
            </div>
        </div>
    )
};

const initialState = {
    error: {
        message: ''
    }
}
const UploadButton = () => {
    const { pending } = useFormStatus()
    return (
        <button disabled={pending}>{pending ? "Loading..." : "Upload"}</button>
    )
}
const UploadAssets = () => {
    const [state, action] = useActionState(upload, initialState)
    console.log(state?.error.message, state)
    return (
        <form action={action}>
            <label htmlFor='prompt'>Enter the prompt used:</label>
            <input type='text' name='prompt' />
            <Collection label='noise' />
            <Collection label='noise_pred' />
            <Collection label='lrp_noise1' />
            <Collection label='lrp_noise2' />
            <Collection label='text_key_scores' />
            <Collection label='text_value_scores' />
            <UploadButton />
            <p>{state?.error?.message}</p>
        </form>
    )
};

export default UploadAssets
