import { useFormContext, useController } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function EnvKeyValue({ name }: { name: string }) {
  const { control } = useFormContext();

  const {
    field: keyField,
    fieldState: { error },
  } = useController({
    name: `${name}.key`,
    control,
    rules: {
      pattern: {
        value: /^\w+$/,
        message: "Only the alphanumeric characters or the underscore",
      },
    },
  });

  const { field: valueField } = useController({
    name: `${name}.value`,
    control,
  });

  return (
    <Row className="m-1">
      <Col xs={4}>
        <Form.Control
          isInvalid={!!error}
          type="text"
          onBlur={keyField.onBlur}
          onChange={keyField.onChange}
          value={keyField.value}
          ref={keyField.ref}
        />
        <Form.Control.Feedback type="invalid">{error?.message}</Form.Control.Feedback>
      </Col>
      <Col xs={8}>
        <Form.Control
          type="text"
          onBlur={valueField.onBlur}
          onChange={valueField.onChange}
          value={valueField.value}
          ref={valueField.ref}
        />
      </Col>
    </Row>
  );
}
