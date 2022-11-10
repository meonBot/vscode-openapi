import styled from "styled-components";

import { useAppSelector, useAppDispatch } from "./store";
import { goBack } from "../../features/router/slice";

import ResponseTabs from "../../components/response/ResponseTabs";

export default function Response() {
  const response = useAppSelector((state) => state.scan.response!);
  const dispatch = useAppDispatch();

  return (
    <Container>
      <ResponseTabs response={response} goBack={() => dispatch(goBack())} />
    </Container>
  );
}

const Container = styled.div``;
