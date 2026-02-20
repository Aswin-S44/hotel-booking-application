import { CheckFormInput, SelectFormInput, TextFormInput } from "@/components";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
} from "react-bootstrap";
import { useFieldArray } from "react-hook-form";
import { BsPeopleFill, BsTrash } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";

const SpecialRequest = [
  "Smoking room",
  "Late check-in",
  "Early check-in",
  "Room on a high floor",
  "Large bed",
  "Airport transfer",
  "Twin beds",
];

const GuestDetails = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "guests",
  });

  return (
    <Card className="shadow">
      <CardHeader className="card-header border-bottom p-4">
        <h4 className="card-title mb-0 items-center">
          <BsPeopleFill className=" me-2" />
          Guest Details
        </h4>
      </CardHeader>
      <CardBody className="p-4">
        <div className="row g-4">
          {fields.map((field, index) => (
            <div key={field.id} className="row g-4 mb-3">
              <Col xs={12}>
                <div className="bg-light rounded-2 px-4 py-3 d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">
                    {index === 0 ? "Main Guest" : `Guest ${index + 1}`}
                  </h6>
                  {index > 0 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <BsTrash />
                    </Button>
                  )}
                </div>
              </Col>
              <Col md={2}>
                <div className="form-size-lg">
                  <label className="form-label">Title</label>
                  <SelectFormInput
                    name={`guests.${index}.title`}
                    control={control}
                    className="form-select js-choice"
                  >
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                  </SelectFormInput>
                </div>
              </Col>
              <TextFormInput
                name={`guests.${index}.firstName`}
                type="text"
                label="First Name"
                control={control}
                placeholder="Enter your first name"
                className="form-control-lg"
                containerClass="col-md-5"
              />
              <TextFormInput
                name={`guests.${index}.lastName`}
                label="Last Name"
                type="text"
                control={control}
                placeholder="Enter your last name"
                className="form-control-lg"
                containerClass="col-md-5"
              />
            </div>
          ))}

          <Col xs={12}>
            <Button
              variant="link"
              className="mb-0 p-0 items-center"
              onClick={() =>
                append({ title: "Mr", firstName: "", lastName: "" })
              }
            >
              <FaPlus className="fa-solid me-2" />
              Add New Guest
            </Button>
          </Col>

          <Col md={6}>
            <TextFormInput
              name="email"
              label="Email id"
              type="text"
              control={control}
              placeholder="Enter your email"
              className="form-control-lg"
            />
            <div id="emailHelp" className="form-text">
              (Booking voucher will be sent to this email ID)
            </div>
          </Col>
          <TextFormInput
            name="phone"
            label="Mobile number"
            type="text"
            control={control}
            placeholder="Enter your mobile number"
            className="form-control-lg"
            containerClass="col-md-6"
          />
        </div>
        {/* <Alert variant="info" className="my-4" role="alert">
          <Link to="/auth/sign-up" className="alert-heading h6">
            Login
          </Link>{" "}
          to prefill all details and get access to secret deals
        </Alert> */}
        {/* <Card className="border mt-4">
          <CardHeader className="border-bottom">
            <h5 className="card-title mb-0">Special request</h5>
          </CardHeader>
          <CardBody>
            <div className="hstack flex-wrap gap-3">
              {SpecialRequest.map((request, idx) => {
                return (
                  <CheckFormInput
                    key={idx}
                    id={`checkbox-${idx}`}
                    type="checkbox"
                    name="specialRequests"
                    value={request}
                    label={request}
                    control={control}
                  />
                );
              })}
            </div>
          </CardBody>
        </Card> */}
      </CardBody>
    </Card>
  );
};

export default GuestDetails;
