import styled from "styled-components";

import { useAppDispatch, useAppSelector } from "./store";

import { PlainSelect } from "../../components/Select";
import { changeFilter } from "./slice";
import { HttpMethods } from "@xliic/openapi";

export default function FilterMethod() {
  const { filter } = useAppSelector((state) => state.scan);
  const dispatch = useAppDispatch();
  const options = HttpMethods.map((method, index) => ({
    value: index,
    label: method.toUpperCase(),
  }));

  return (
    <Container>
      <PlainSelect
        label="Method"
        options={options}
        placeholder="All"
        onSelectedItemChange={(item) => {
          if (item && item.value !== "all") {
            dispatch(
              changeFilter({ ...filter, method: item.value as number, operationId: undefined })
            );
          } else {
            dispatch(changeFilter({ ...filter, method: undefined, operationId: undefined }));
          }
        }}
        selected={filter.method ?? "all"}
      />
    </Container>
  );
}

const Container = styled.div`
  width: 264px;
`;
