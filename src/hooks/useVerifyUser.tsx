import { Dispatch, useReducer } from 'react';

export interface SignupPageAction {
  type: 'verify' | 'update-mail' | 'update-otp';
  input?: string;
  inputTimeout?: string;
}

export interface SignupPageState {
  verify: boolean;
  otp: string;
  mail: string;
  timeout: string;
  token: string;
}

const initialScanPageState: SignupPageState = {
  verify: false,
  otp: '',
  timeout: '',
  mail: '',
  token: ''
};

function reducer(state: SignupPageState, action: SignupPageAction): SignupPageState {
  switch (action.type) {
    case 'verify':
      return {
        mail: state.mail,
        otp: state.otp,
        timeout: state.timeout,
        token: action.input as string,
        verify: true
      };
    case 'update-mail':
      return {
        verify: state.verify,
        token: state.token,
        mail: action.input as string,
        timeout: action.inputTimeout as unknown as string,
        otp: ''
      };
    case 'update-otp':
      return {
        verify: state.verify,
        token: state.token,
        mail: state.mail,
        timeout: action.inputTimeout as unknown as string,
        otp: action.input as string
      };
  }
}

export default function useVerifyUser(): [SignupPageState, Dispatch<SignupPageAction>] {
  const [state, dispatch] = useReducer(reducer, initialScanPageState);
  return [state, dispatch];
}
