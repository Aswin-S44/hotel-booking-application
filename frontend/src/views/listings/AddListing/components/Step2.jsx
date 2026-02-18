import { FileFormInput, SelectFormInput, TextFormInput } from "@/components";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import ReactQuill from "react-quill-new";
import { Card, CardBody, CardHeader, Col, Row, Button } from "react-bootstrap";
import { BsPlusCircle, BsTrash } from "react-icons/bs";
import { useWizard } from "react-use-wizard";

const Step2 = () => {
  const { control, trigger } = useFormContext();
  const { previousStep, nextStep } = useWizard();
  const { fields, append, remove } = useFieldArray({ control, name: "rooms" });

  const handleNext = async () => {
    const isValid = await trigger([
      "amenities",
      "description",
      "totalFloors",
      "totalRooms",
      "propertyArea",
      "rooms",
    ]);
    if (isValid) nextStep();
  };

  return (
    <div className="vstack gap-4">
      <h4 className="mb-0">Detailed Information</h4>
      <Card className="shadow">
        <CardHeader className="border-bottom">
          <h5 className="mb-0">Overview</h5>
        </CardHeader>
        <CardBody>
          <Row className="g-4">
            <Col xs={12}>
              <label className="form-label">Select amenities *</label>
              <Controller
                name="amenities"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <SelectFormInput
                      {...field}
                      className="form-select js-choice border-0 z-index-9 bg-transparent"
                      multiple
                    >
                      <option value="Swimming pool">Swimming pool</option>
                      <option value="Spa">Spa</option>
                      <option value="Gym">Gym</option>
                    </SelectFormInput>
                    {error && (
                      <div className="text-danger small mt-1">
                        {error.message}
                      </div>
                    )}
                  </>
                )}
              />
            </Col>
            <Col xs={12}>
              <label className="form-label">Add description *</label>
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <ReactQuill
                      value={field.value}
                      onChange={field.onChange}
                      theme="snow"
                    />
                    {error && (
                      <div className="text-danger small mt-1">
                        {error.message}
                      </div>
                    )}
                  </>
                )}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card className="shadow">
        <CardHeader className="border-bottom">
          <h5 className="mb-0">Size Of Your Listing</h5>
        </CardHeader>
        <CardBody>
          <Row className="g-4">
            <TextFormInput
              name="totalFloors"
              label="Total Floor *"
              control={control}
              containerClass="col-md-4"
            />
            <TextFormInput
              name="totalRooms"
              label="Total Room *"
              control={control}
              containerClass="col-md-4"
            />
            <TextFormInput
              name="propertyArea"
              label="Room area *"
              control={control}
              containerClass="col-md-4"
            />
          </Row>
        </CardBody>
      </Card>

      {fields.map((item, index) => (
        <Card className="shadow" key={item.id}>
          <CardHeader className="border-bottom d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Room Option {index + 1}</h5>
            {fields.length > 1 && (
              <Button
                variant="link"
                className="text-danger p-0"
                onClick={() => remove(index)}
              >
                <BsTrash size={20} />
              </Button>
            )}
          </CardHeader>
          <CardBody>
            <Row className="g-4">
              <TextFormInput
                name={`rooms.${index}.roomName`}
                label="Room name *"
                control={control}
                containerClass="col-md-6"
              />
              <Col md={6}>
                <FileFormInput
                  name={`rooms.${index}.roomThumbnail`}
                  control={control}
                  label="Room thumbnail image *"
                />
              </Col>
              <TextFormInput
                name={`rooms.${index}.price`}
                label="Room Price *"
                control={control}
                containerClass="col-md-6"
              />
              <TextFormInput
                name={`rooms.${index}.discount`}
                label="Discount *"
                control={control}
                containerClass="col-md-6"
              />
            </Row>
          </CardBody>
        </Card>
      ))}

      <div className="text-center">
        <Button
          variant="link"
          className="p-0 text-primary"
          onClick={() =>
            append({ roomName: "", price: "", discount: "", roomThumbnail: "" })
          }
        >
          <BsPlusCircle className="me-2" /> Add New Room
        </Button>
      </div>

      <div className="hstack gap-2 flex-wrap justify-content-between">
        <button
          type="button"
          onClick={previousStep}
          className="btn btn-secondary prev-btn mb-0"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="btn btn-primary next-btn mb-0"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2;
