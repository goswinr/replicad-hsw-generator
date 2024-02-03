import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";

import useAppState from "../useAppState";

export const InputTitle = styled.label`
  font-variant: small-caps;
  font-size: 0.8em;
  font-weight: normal;
`;
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InputBlock = ({ title, htmlFor, children }) => {
  return (
    <InputWrapper>
      <InputTitle htmlFor={htmlFor}>{title}</InputTitle>
      {children}
    </InputWrapper>
  );
};

export const ActiveText = styled.span`
  font-weight: bold;
  color: var(--color);
  cursor: pointer;
`;

export const BaseInline = styled.div`
  display: flex;
  align-items: center;

  & > label + input {
    margin-left: 0.3em;
  }

  & > input + label {
    margin-left: 1em;
  }
`;

export const Inline = styled(BaseInline)`
  & > input {
    flex: 1 1 auto;
  }
`;

const SaveButtons = styled.div`
  display: flex;
  justify-content: flex-end;

  margin-top: 2em;
  padding-bottom: 0.6em;

  & > :not(:first-child) {
    margin-left: 1em;
  }

  & > :last-child {
    width: 100%;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  & > :not(:last-child):not(hr) {
    margin-bottom: 0.6rem;
  }
`;

export const SaveButtonRow = observer(({ saveDisabled }) => {
  const state = useAppState();

  return (
    <SaveButtons>
      <button role="submit" disabled={state.processing || saveDisabled}>
        Apply
      </button>
    </SaveButtons>
  );
});
