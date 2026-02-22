import { PageMetaData } from '@/components';
import BlogDetails from './components/BlogDetails';
import FooterWithLinks from './components/FooterWithLinks';
import Hero from './components/Hero';
import TopNavBar11 from './components/TopNavBar11';
import TopNavBar from '../../hotels/Home/components/TopNavBar';
const BlogDetail = () => {
  return <>
      <PageMetaData title="Blog Details" />

      <TopNavBar />

      <main>
        <Hero />
        <BlogDetails />
      </main>

      <FooterWithLinks />
    </>;
};
export default BlogDetail;