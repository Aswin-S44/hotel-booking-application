import { PageMetaData } from "@/components";
import PersonalInformation from "./components/PersonalInformation";
import ProfileProgress from "./components/ProfileProgress";
import UpdateEmail from "./components/UpdateEmail";
import UpdatePassword from "./components/UpdatePassword";
import CustomerInformation from "./components/customerInformation";

const CustomerProfile = () => {
  return (
    <>
      <PageMetaData title="User Profile" />

      <div className="vstack gap-4">
        {/* <ProfileProgress /> */}

        <CustomerInformation />

        <UpdateEmail />

        <UpdatePassword />
      </div>
    </>
  );
};
export default CustomerProfile;
