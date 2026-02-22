import { PageMetaData } from '@/components';
import ActionBox from './components/ActionBox';
import FooterWithLinks from './components/FooterWithLinks';
import Hero from './components/Hero';
import Teams from './components/Teams';
import TopNavBar11 from './components/TopNavBar11';
import TopNavBar from '../../hotels/Home/components/TopNavBar';
const OurTeam = () => {
  return <>
      <PageMetaData title="Our Team" />

      <TopNavBar />

      <main>
        <Hero />
        <Teams />
        <ActionBox />
      </main>

      <FooterWithLinks />
    </>;
};
export default OurTeam;