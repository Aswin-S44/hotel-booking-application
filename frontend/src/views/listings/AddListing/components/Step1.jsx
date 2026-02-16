import {
  CheckFormInput,
  DropzoneFormInput,
  FileFormInput,
  SelectFormInput,
  TextAreaFormInput,
  TextFormInput,
} from "@/components";
import { Button, Card, CardBody, CardHeader, Col, Row } from "react-bootstrap";
import { useWizard } from "react-use-wizard";
import { Controller } from "react-hook-form";

const ListingCategory = ({ control }) => {
  return (
    <Card className="shadow">
      <CardHeader className="border-bottom">
        <h5 className="mb-0">Choose Listing Category</h5>
      </CardHeader>
      <CardBody>
        <Row className="g-4">
          <Col xs={12}>
            <label className="form-label">Choose listing type *</label>
            <Controller
              name="listingType"
              control={control}
              render={({ field }) => (
                <SelectFormInput {...field} className="form-select js-choice">
                  <option value="">Select type</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Villa">Villa</option>
                  <option value="Home Stay">Home Stay</option>
                  <option value="Farmhouse">Farmhouse</option>
                  <option value="House boat">House boat</option>
                </SelectFormInput>
              )}
            />
          </Col>
          <Col xs={12}>
            <TextFormInput
              control={control}
              label="Listing name *"
              name="listingName"
              placeholder="Enter Place Name"
            />
          </Col>
          <Col xs={12}>
            <label className="form-label">Listing usage type *</label>
            <div className="d-sm-flex">
              <CheckFormInput
                name="listingUse"
                control={control}
                label="Entire Place"
                type="radio"
                containerClass="form-check radio-bg-light me-4"
                id="entire-place"
                value="Entire Place"
              />
              <CheckFormInput
                name="listingUse"
                control={control}
                label="For Guests"
                type="radio"
                id="for-guests"
                containerClass="form-check radio-bg-light me-4"
                value="For Guests"
              />
              <CheckFormInput
                name="listingUse"
                control={control}
                label="For Personal"
                type="radio"
                id="for-personal"
                containerClass="form-check radio-bg-light"
                value="For Personal"
              />
            </div>
          </Col>
          <Col xs={12}>
            <TextAreaFormInput
              control={control}
              name="shortDescription"
              rows={2}
              label="Short description *"
              placeholder="Enter keywords"
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

const ListingLocation = ({ control }) => {
  return (
    <Card className="shadow">
      <CardHeader className="border-bottom">
        <h5 className="mb-0">Listing Location</h5>
      </CardHeader>
      <CardBody>
        <Row className="g-3">
          <Col md={6}>
            <label className="form-label">Country/Region *</label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <SelectFormInput {...field} className="form-select js-choice">
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="USA">Usa</option>
                </SelectFormInput>
              )}
            />
          </Col>
          <Col md={6}>
            <label className="form-label">State *</label>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <SelectFormInput {...field} className="form-select js-choice">
                  <option value="">Select state</option>
                  <option value="India">India</option>
                  <option value="USA">Usa</option>
                </SelectFormInput>
              )}
            />
          </Col>
          <TextFormInput
            name="city"
            label="City *"
            placeholder="Enter city"
            containerClass="col-md-6"
            control={control}
          />
          <TextFormInput
            name="postalCode"
            label="Postal number *"
            placeholder="Enter postal number"
            containerClass="col-md-6"
            control={control}
          />
          <TextFormInput
            name="street"
            label="Street *"
            placeholder="Enter street"
            control={control}
            containerClass="col-12"
          />
          <TextFormInput
            name="latitude"
            label="Latitude *"
            placeholder="Enter latitude"
            control={control}
            containerClass="col-md-6"
          />
          <TextFormInput
            name="longitude"
            label="Longitude *"
            placeholder="Enter Longitude"
            control={control}
            containerClass="col-md-6"
          />
        </Row>
      </CardBody>
    </Card>
  );
};

const UploadImages = ({ control }) => {
  return (
    <Card className="shadow">
      <CardHeader className="border-bottom">
        <h5 className="mb-0">Upload Images</h5>
      </CardHeader>
      <CardBody>
        <Row className="g-3">
          <Col xs={12}>
            <FileFormInput
              name="thumbnail"
              control={control}
              label="Upload thumbnail image *"
            />
          </Col>
          <Col xs={12}>
            <Controller
              name="gallery"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DropzoneFormInput
                  label="Upload image gallery *"
                  onFileUpload={onChange}
                  value={value}
                  showPreview
                />
              )}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

const Step1 = ({ control }) => {
  const { nextStep } = useWizard();
  return (
    <div className="vstack gap-4">
      <h4 className="mb-0">Basic Information</h4>
      <ListingCategory control={control} />
      <ListingLocation control={control} />
      <UploadImages control={control} />
      <div className="text-end">
        <Button onClick={nextStep} variant="primary" className="next-btn mb-0">
          Next
        </Button>
      </div>
    </div>
  );
};

export default Step1;
