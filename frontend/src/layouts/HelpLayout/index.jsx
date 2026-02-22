import { Preloader } from '@/components';
import { Suspense, lazy } from 'react';
import TopNavBar from '../../views/hotels/Home/components/TopNavBar';
const FooterWithLinks = lazy(() => import('./FooterWithLinks'));
const HelpLayout = ({
  children
}) => {
  return <>
      <Suspense>
   <TopNavBar />
   
      </Suspense>

      <Suspense fallback={<Preloader />}>
        <main>{children}</main>
      </Suspense>

      <Suspense>
        <FooterWithLinks />
      </Suspense>
    </>;
};
export default HelpLayout;