import { SelectFormInput, TextFormInput } from "@/components";
import { Controller } from "react-hook-form";
import ReactQuill from "react-quill-new";
import { Card, CardBody, CardHeader, Col, Row, Button } from "react-bootstrap";
import { useWizard } from "react-use-wizard";

const ListingPrice = ({ control }) => {
  return (
    <Card className="shadow">
      <CardHeader className="border-bottom">
        <h5 className="mb-0">Listing Price</h5>
      </CardHeader>
      <CardBody>
        <Row className="g-4">
          <Col md={6}>
            <label className="form-label">Currency</label>
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <SelectFormInput
                  {...field}
                  className="form-select js-choice border-0 z-index-9 bg-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="EURO">EURO</option>
                </SelectFormInput>
              )}
            />
          </Col>
          <TextFormInput
            name="basePrice"
            label="Base Price *"
            control={control}
            containerClass="col-md-6"
          />
          <TextFormInput
            name="discount3"
            label="Discount *"
            control={control}
            containerClass="col-md-6"
          />
        </Row>
      </CardBody>
    </Card>
  );
};

const ListingPolicy = ({ control }) => {
  return (
    <Card className="shadow">
      <CardHeader className="border-bottom">
        <h5 className="mb-0">Listing Policy</h5>
      </CardHeader>
      <CardBody>
        <Row className="g-4">
          <Col xs={12}>
            <label className="form-label">Add description *</label>
            <Controller
              name="listingPolicyDescription"
              control={control}
              render={({ field }) => (
                <ReactQuill
                  value={field.value}
                  onChange={field.onChange}
                  theme="snow"
                />
              )}
            />
          </Col>
          <TextFormInput
            name="charges"
            label="Charges *"
            control={control}
            containerClass="col-md-6"
          />
        </Row>
      </CardBody>
    </Card>
  );
};

const Step3 = ({ control }) => {
  const { previousStep } = useWizard();
  return (
    <div className="vstack gap-4">
      <h4 className="mb-0">Price &amp; Policy</h4>
      <ListingPrice control={control} />
      <ListingPolicy control={control} />
      <div className="d-flex justify-content-between">
        <button
          type="button"
          onClick={previousStep}
          className="btn btn-secondary prev-btn mb-0"
        >
          Previous
        </button>
        <Button type="submit" variant="success" className="mb-0">
          Add Listing
        </Button>
      </div>
    </div>
  );
};

export default Step3;
