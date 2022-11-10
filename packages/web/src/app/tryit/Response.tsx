import styled from "styled-components";

import { useAppSelector, useAppDispatch } from "./store";
import { goBack } from "../../features/router/slice";

import ResponseTabs from "../../components/response/ResponseTabs";
import Tools from "./Tools";

export default function Response() {
  const response = useAppSelector((state) => state.tryit.response!);
  const dispatch = useAppDispatch();

  return (
    <Container>
      <ResponseTabs
        response={response}
        tools={<Tools response={response} />}
        goBack={() => dispatch(goBack())}
      />
    </Container>
  );
}

const Container = styled.div``;
