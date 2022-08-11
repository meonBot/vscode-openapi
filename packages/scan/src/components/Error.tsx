import styled from "styled-components";
import Button from "react-bootstrap/Button";
import { ThemeColors } from "@xliic/common/theme";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { goBack } from "../store/oasSlice";

export default function Error() {
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.oas.error!);

  return (
    <Container>
      <Header>
        <Message>
          <Title>Failed to send request</Title>
        </Message>
        <Button variant="primary" onClick={() => dispatch(goBack())}>
          Back
        </Button>
      </Header>
      <ErrorText>{error.message}</ErrorText>
      {error.sslError && (
        <div>Failed to establish secure connection. Try disabling SSL validation in Settings</div>
      )}
    </Container>
  );
}

const Message = styled.div`
  border: 1px solid var(${ThemeColors.border});
  border-radius: 0.375rem;
  margin-right: 0.25rem;
  display: flex;
  overflow: hidden;
  flex: 1;
  align-items: center;
`;

const Title = styled.div`
  flex: 1;
  padding-left: 0.5rem;
`;

const Header = styled.div`
  display: flex;
`;

const ErrorText = styled.div`
  border: 1px solid var(${ThemeColors.errorBorder});
  color: var(${ThemeColors.errorForeground});
  background-color: var(${ThemeColors.errorBackground});
  border-radius: 0.375rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
`;

const Container = styled.div`
  margin-top: 0.25rem;
  margin-left: 0.25rem;
  margin-right: 0.25rem;
`;