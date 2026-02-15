import { BackToTop } from '@/components';
import AppRouter from '@/routes/router';
import { AuthProvider, LayoutProvider, NotificationProvider } from '@/states';
import { CookiesProvider } from "react-cookie";



const App = () => {
  return <CookiesProvider>
      <NotificationProvider>
        <LayoutProvider> 
          <AuthProvider>
            <AppRouter />
            <BackToTop />
          </AuthProvider>
        </LayoutProvider>
      </NotificationProvider>
    </CookiesProvider>;
};
export default App;