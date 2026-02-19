import { PageMetaData } from '@/components';
import FooterWithLinks from './components/FooterWithLinks';
import Hero from './components/Hero';
import HotelGridLayout from './components/HotelGridLayout';
import HotelListFilter from './components/HotelListFilter';
import TopNavBar4 from './components/TopNavBar4';
import TopNavBar from '../Home/components/TopNavBar';
const HotelsGrid = () => {







  return <>
    <PageMetaData title="Hotel - Grid" />

    <TopNavBar />
    <main>
      <Hero />

      <HotelListFilter />

      <HotelGridLayout />
    </main>

    <FooterWithLinks />
  </>;
};
export default HotelsGrid;