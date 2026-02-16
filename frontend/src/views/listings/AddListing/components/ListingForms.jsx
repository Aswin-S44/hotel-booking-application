import { yupResolver } from "@hookform/resolvers/yup";
import { Container } from "react-bootstrap";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { Wizard, useWizard } from "react-use-wizard";
import { useAuthContext } from "../../../../states/useAuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { goToStep, activeStep } = useWizard();
  return (
    <div className="bs-stepper-header pb-5" role="tablist">
      <div
        className={`step ${activeStep === 0 && "active"}`}
        onClick={() => goToStep(0)}
      >
        <div className="text-center">
          <button type="button" className="btn btn-link step-trigger mb-0">
            <span className="bs-stepper-circle">1</span>
          </button>
          <h6 className="bs-stepper-label d-none d-md-block">
            Basic Information
          </h6>
        </div>
      </div>
      <div className="line" />
      <div
        className={`step ${activeStep === 1 && "active"}`}
        onClick={() => goToStep(1)}
      >
        <div className="text-center">
          <button type="button" className="btn btn-link step-trigger mb-0">
            <span className="bs-stepper-circle">2</span>
          </button>
          <h6 className="bs-stepper-label d-none d-md-block">
            Detailed Information
          </h6>
        </div>
      </div>
      <div className="line" />
      <div
        className={`step ${activeStep === 2 && "active"}`}
        onClick={() => goToStep(2)}
      >
        <div className="text-center">
          <button type="button" className="btn btn-link step-trigger mb-0">
            <span className="bs-stepper-circle">3</span>
          </button>
          <h6 className="bs-stepper-label d-none d-md-block">
            Price &amp; Policy
          </h6>
        </div>
      </div>
    </div>
  );
};

const ListingForms = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const listingSchema = yup.object({
    listingName: yup.string().required("Please enter your listing name"),
    listingType: yup.string().required("Please select usage type"),
    shortDescription: yup.string().required("Please enter a short description"),
    thumbnail: yup.mixed().required("Thumbnail Image is required"),
  });

  const methods = useForm({
    resolver: yupResolver(listingSchema),
    defaultValues: {
      listingType: "",
      listingName: "",
      listingUse: "Entire Place",
      shortDescription: "",
      country: "",
      state: "",
      city: "",
      postalCode: "",
      street: "",
      latitude: "",
      longitude: "",
      amenities: [],
      description: "",
      totalFloors: "",
      totalRooms: "",
      propertyArea: "",
      gallery: [],
      rooms: [{ roomName: "", price: "", discount: "", roomThumbnail: "" }],
      currency: "USD",
      basePrice: "",
      discount3: "",
      listingPolicyDescription: "",
      charges: "",
    },
  });

  const token = localStorage.getItem("token");

  const onSubmit = async (formData) => {
    if (user && user._id && formData) {
      const transformedData = {
        owner: user._id,
        listingName: formData?.listingName ?? "",
        listingType: formData?.listingType ?? "",
        listingUse: formData?.listingUse ?? "",
        shortDescription: formData?.shortDescription ?? "",
        location: {
          country: formData?.country ?? "",
          state: formData?.state ?? "",
          city: formData?.city ?? "",
          street: formData?.street ?? "",
          postalCode: formData?.postalCode ?? "",
          coordinates: {
            type: "Point",
            coordinates: [
              formData?.longitude ? parseFloat(formData.longitude) : 0,
              formData?.latitude ? parseFloat(formData.latitude) : 0,
            ],
          },
        },
        amenities: formData?.amenities ?? [],
        description: formData?.description ?? "",
        thumbnail: formData?.thumbnail?.base64 ?? "",
        gallery: Array.isArray(formData?.gallery)
          ? formData.gallery.map((img) => img?.base64 ?? "")
          : [],
        policy: {
          description: formData?.listingPolicyDescription ?? "",
          cancellationOption: "Flexible",
          extraCharges: formData?.charges ? parseFloat(formData.charges) : 0,
        },
        currency: formData?.currency ?? "INR",
        basePrice: formData?.basePrice ? parseFloat(formData.basePrice) : 0,
        discount: formData?.discount3 ? parseFloat(formData.discount3) : 0,
        starRating: 5,
        totalFloors: formData?.totalFloors ? parseInt(formData.totalFloors) : 0,
        totalRooms: formData?.totalRooms ? parseInt(formData.totalRooms) : 0,
        propertyArea: formData?.propertyArea
          ? parseInt(formData.propertyArea)
          : 0,
        rooms: Array.isArray(formData?.rooms)
          ? formData.rooms.map((room) => ({
              roomName: room?.roomName ?? "",
              roomThumbnail: room?.roomThumbnail?.base64 ?? "",
              price: room?.price ? parseFloat(room.price) : 0,
              discount: room?.discount ? parseFloat(room.discount) : 0,
              additionalInfo: "",
              roomArea: 0,
            }))
          : [],
      };

      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/shops/property",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(transformedData),
          }
        );

        const result = await response.json();

        if (result && result.success) {
          Swal.fire({
            title: "Good job!",
            text: "You property is added!",
            icon: "success",
          });
          navigate("/agent/dashboard");
        }
      } catch (error) {
        console.error("Submission Error:", error);
      }
    }
  };

  return (
    <section>
      <Container>
        <div className="bs-stepper stepper-outline">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Wizard header={<Header />}>
                <Step1 control={methods.control} />
                <Step2 control={methods.control} />
                <Step3 control={methods.control} />
              </Wizard>
            </form>
          </FormProvider>
        </div>
      </Container>
    </section>
  );
};

export default ListingForms;
