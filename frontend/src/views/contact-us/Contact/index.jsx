import { PageMetaData } from '@/components';
import AddressMap from './components/AddressMap';
import ContactForm from './components/ContactForm';
import FooterWithLinks from './components/FooterWithLinks';
import Hero from './components/Hero';
import TopNavBar11 from './components/TopNavBar11';
import TopNavBar from '../../hotels/Home/components/TopNavBar';
const Contact = () => {
  return <>
      <PageMetaData title="Contact Us" />

      <TopNavBar />

      <main>
        <Hero />
        <ContactForm />
        <AddressMap />
      </main>

      <FooterWithLinks />
    </>;
};
export default Contact;