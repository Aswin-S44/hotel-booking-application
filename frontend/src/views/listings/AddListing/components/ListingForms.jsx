import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Container, Spinner } from "react-bootstrap";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { Wizard, useWizard } from "react-use-wizard";
import { useAuthContext } from "../../../../states/useAuthContext";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../../../config/env";

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
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const listingSchema = yup.object({
    listingName: yup.string().required("Listing name is required"),
    listingType: yup.string().required("Listing type is required"),
    listingUse: yup.string().required("Usage type is required"),
    shortDescription: yup.string().required("Short description is required"),
    country: yup.string().required("Country is required"),
    state: yup.string().required("State is required"),
    city: yup.string().required("City is required"),
    postalCode: yup.string().required("Postal code is required"),
    street: yup.string().required("Street is required"),
    latitude: yup
      .number()
      .typeError("Must be a number")
      .required("Latitude is required"),
    longitude: yup
      .number()
      .typeError("Must be a number")
      .required("Longitude is required"),
    thumbnail: yup.mixed().required("Thumbnail is required"),
    gallery: yup.array().min(1, "At least one gallery image is required"),
    amenities: yup.array().min(1, "Select at least one amenity"),
    description: yup.string().required("Description is required"),
    totalFloors: yup
      .number()
      .typeError("Must be a number")
      .required("Required"),
    totalRooms: yup.number().typeError("Must be a number").required("Required"),
    propertyArea: yup
      .number()
      .typeError("Must be a number")
      .required("Required"),
    rooms: yup.array().of(
      yup.object({
        roomName: yup.string().required("Room name required"),
        price: yup
          .number()
          .typeError("Must be a number")
          .required("Price required"),
        discount: yup.number().typeError("Must be a number").default(0),
        roomThumbnail: yup.mixed().required("Room image required"),
      })
    ),
    currency: yup.string().required("Currency is required"),
    basePrice: yup
      .number()
      .typeError("Must be a number")
      .required("Base price is required"),
    discount3: yup.number().typeError("Must be a number").default(0),
    listingPolicyDescription: yup
      .string()
      .required("Policy description is required"),
    charges: yup
      .number()
      .typeError("Must be a number")
      .required("Charges are required"),
  });

  const methods = useForm({
    resolver: yupResolver(listingSchema),
    mode: "onChange",
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

  const { reset } = methods;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      const fetchProperty = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/v1/shops/property/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const result = await response.json();
          if (result.success) {
            const item = result.data;
            reset({
              listingName: item.listingName,
              listingType: item.listingType,
              listingUse: item.listingUse,
              shortDescription: item.shortDescription,
              country: item.location.country,
              state: item.location.state,
              city: item.location.city,
              postalCode: item.location.postalCode,
              street: item.location.street,
              longitude: item.location.coordinates.coordinates[0],
              latitude: item.location.coordinates.coordinates[1],
              amenities: item.amenities,
              description: item.description,
              thumbnail: item.thumbnail,
              gallery: item.gallery,
              totalFloors: item.totalFloors,
              totalRooms: item.totalRooms,
              propertyArea: item.propertyArea,
              currency: item.currency,
              basePrice: item.basePrice,
              discount3: item.discount,
              listingPolicyDescription: item.policy.description,
              charges: item.policy.extraCharges,
              rooms: item.rooms.map((r) => ({
                roomName: r.roomName,
                price: r.price,
                discount: r.discount,
                roomThumbnail: r.roomThumbnail,
              })),
            });
          }
        } catch (error) {
          console.error("Fetch Error:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id, reset, token]);

  const onSubmit = async (formData) => {
    const transformedData = {
      owner: user._id,
      listingName: formData.listingName,
      listingType: formData.listingType,
      listingUse: formData.listingUse,
      shortDescription: formData.shortDescription,
      location: {
        country: formData.country,
        state: formData.state,
        city: formData.city,
        street: formData.street,
        postalCode: formData.postalCode,
        coordinates: {
          type: "Point",
          coordinates: [
            parseFloat(formData.longitude),
            parseFloat(formData.latitude),
          ],
        },
      },
      amenities: formData.amenities,
      description: formData.description,
      thumbnail: formData.thumbnail?.base64 || formData.thumbnail,
      gallery: formData.gallery.map((img) => img?.base64 || img),
      policy: {
        description: formData.listingPolicyDescription,
        cancellationOption: "Flexible",
        extraCharges: parseFloat(formData.charges),
      },
      currency: formData.currency,
      basePrice: parseFloat(formData.basePrice),
      discount: parseFloat(formData.discount3),
      starRating: 5,
      totalFloors: parseInt(formData.totalFloors),
      totalRooms: parseInt(formData.totalRooms),
      propertyArea: parseInt(formData.propertyArea),
      rooms: formData.rooms.map((room) => ({
        roomName: room.roomName,
        roomThumbnail: room.roomThumbnail?.base64 || room.roomThumbnail,
        price: parseFloat(room.price),
        discount: parseFloat(room.discount),
        additionalInfo: "",
        roomArea: 0,
      })),
    };

    try {
      const url = id
        ? `${API_BASE_URL}/api/v1/shops/property/${id}`
        : `${API_BASE_URL}/api/v1/shops/property`;
      const method = id ? "PATCH" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transformedData),
      });
      const result = await response.json();
      if (result.success) {
        Swal.fire({
          title: "Success!",
          text: id ? "Property updated!" : "Property added!",
          icon: "success",
        });
        navigate("/agent/listings");
      }
    } catch (error) {
      console.error("Submission Error:", error);
    }
  };

  if (loading)
    return (
      <div className="text-center p-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <section>
      <Container>
        <div className="bs-stepper stepper-outline">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Wizard header={<Header />}>
                <Step1 />
                <Step2 />
                <Step3 isEdit={!!id} />
              </Wizard>
            </form>
          </FormProvider>
        </div>
      </Container>
    </section>
  );
};

export default ListingForms;
