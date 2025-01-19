import styles from '@/app/page.module.css';
import Image from 'next/image';
import lrp_heatmap from '@/public/lrp_heatmap_example.png';
import SingleIteration from '@/components/react_flows/SingleIteration';
import SingleGeneration from '@/components/react_flows/SingleGeneration';
import ExampleFlowDiagram from '@/components/react_flows/ExampleFlowDiagram';
import SDSingleGeneration from '@/components/react_flows/SDSingleGeneration';
import SDSingleIteration from '@/components/react_flows/SDSingleIteration';

type BlockProps = Readonly<{
  children: React.ReactNode;
}>
const Block = ({ children }: BlockProps) => {
  return (
    <div className={styles.block}>
      {children}
    </div>
  )
}

const About = () => {
  return (
    <main className={styles.wrapper}>
      <div className={styles.inner_wrapper}>
        <header className={styles.header}>
          <h1>Stable Diffusion &amp; LRP</h1>
          <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in.</h2>
        </header>
        <Block>
          <h3>What is Stable Diffusion?</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada pellentesque tristique. Etiam velit mauris, tempor ac neque vel, mollis rhoncus magna. Ut tempus vulputate tristique. Donec tristique quis orci at mattis. Aenean varius ullamcorper risus, eget interdum augue dictum in.</p>
          <p>Suspendisse blandit pellentesque mauris, sit amet eleifend elit. Pellentesque quis sapien mauris. Integer ut est sed mauris pretium convallis. Praesent sodales sem metus, pellentesque aliquet velit porta vitae. Pellentesque quis mattis elit. Suspendisse augue est, ornare in facilisis eu, faucibus vel quam. Aenean vitae posuere ipsum, in congue dolor.</p>
        </Block>
        <Block>
          <h3>Why LRP?</h3>
          <div className={styles.why_lrp_container}>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada pellentesque tristique. Etiam velit mauris, tempor ac neque vel, mollis rhoncus magna. Ut tempus vulputate tristique. Donec tristique quis orci at mattis. Aenean varius ullamcorper risus, eget interdum augue dictum in. Suspendisse blandit pellentesque mauris, sit amet eleifend elit. Pellentesque quis sapien mauris. Integer ut est sed mauris pretium convallis. Praesent sodales sem metus, pellentesque aliquet velit porta vitae. Pellentesque quis mattis elit. Suspendisse augue est, ornare in facilisis eu, faucibus vel quam. Aenean vitae posuere ipsum, in congue dolor.</p>
            <div className={styles.lrp_heatmap_example}>
              <Image src={lrp_heatmap} fill alt='LRP heatmap example.' sizes={"100cqw"} />
            </div>
          </div>
        </Block>
        <Block>
          <h3>How Propagation Flows in Stable Diffusion</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada pellentesque tristique. Etiam velit mauris, tempor ac neque vel, mollis rhoncus magna. Ut tempus vulputate tristique. Donec tristique quis orci at mattis. Aenean varius ullamcorper risus, eget interdum augue dictum in.</p>
          <SingleIteration />
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada pellentesque tristique. Etiam velit mauris, tempor ac neque vel, mollis rhoncus magna. Ut tempus vulputate tristique. Donec tristique quis orci at mattis. Aenean varius ullamcorper risus, eget interdum augue dictum in.</p>
          <SingleGeneration />
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada pellentesque tristique. Etiam velit mauris, tempor ac neque vel, mollis rhoncus magna. Ut tempus vulputate tristique. Donec tristique quis orci at mattis. Aenean varius ullamcorper risus, eget interdum augue dictum in.</p>
        </Block>
        <Block>
          <h3>Internal Architecture for LRP Integration</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada pellentesque tristique. Etiam velit mauris, tempor ac neque vel, mollis rhoncus magna. Ut tempus vulputate tristique. Donec tristique quis orci at mattis. Aenean varius ullamcorper risus, eget interdum augue dictum in.</p>
          <SDSingleGeneration />
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada pellentesque tristique. Etiam velit mauris, tempor ac neque vel, mollis rhoncus magna. Ut tempus vulputate tristique. Donec tristique quis orci at mattis. Aenean varius ullamcorper risus, eget interdum augue dictum in.</p>
          <SDSingleIteration />
        </Block>
        <Block>
          <h3>Example Flow Diagram</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce malesuada pellentesque tristique. Etiam velit mauris, tempor ac neque vel, mollis rhoncus magna. Ut tempus vulputate tristique. Donec tristique quis orci at mattis. Aenean varius ullamcorper risus, eget interdum augue dictum in.</p>
          <ExampleFlowDiagram />
        </Block>
      </div>
    </main>
  );
}

export default About
