import { PageMetaData } from '@/components';
import BookingDetails from './components/BookingDetails';
import Footer from './components/Footer';
import Hero from './components/Hero';
import TopNavBar4 from './components/TopNavBar4';
import TopNavBar from '../Home/components/TopNavBar';
const HotelBooking = () => {
  return <>
      <PageMetaData title="Hotel - Booking" />

      <main>
        <TopNavBar />
        <Hero />
        <BookingDetails />
      </main>

      <Footer />
    </>;
};
export default HotelBooking;