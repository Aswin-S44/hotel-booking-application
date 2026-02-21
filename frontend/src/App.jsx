import { BackToTop } from '@/components';
import AppRouter from '@/routes/router';
import { AuthProvider, LayoutProvider, NotificationProvider } from '@/states';
import { CookiesProvider } from "react-cookie";
import Footer from './views/hotels/Home/components/Footer';



const App = () => {
  return <CookiesProvider>
    <NotificationProvider>
      <LayoutProvider>
        <AuthProvider>
          <AppRouter />
          <Footer />
          <BackToTop />
        </AuthProvider>
      </LayoutProvider>
    </NotificationProvider>
  </CookiesProvider>;
};
export default App;