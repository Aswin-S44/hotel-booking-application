import { PageMetaData } from '@/components';
import FooterWithLinks from './components/FooterWithLinks';
import Hero from './components/Hero';
import OurStory from './components/OurStory';
import OurTeam from './components/OurTeam';
import TopNavBar11 from './components/TopNavBar11';
import Footer from '../../hotels/Home/components/Footer';
import TopNavBar from '../../hotels/Home/components/TopNavBar';
const About = () => {
  return <>
      <PageMetaData title="About us" />

      <TopNavBar />

      <main>
        <Hero />
        <OurStory />
        <OurTeam />
      </main>

      <FooterWithLinks />
       <Footer />
    </>;
};
export default About;