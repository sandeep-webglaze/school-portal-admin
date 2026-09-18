import { ReactNode } from 'react';

export interface IProps {
  open: boolean;
  title: string;
  subtitle?: string;
  handleClose?: () => void;
  fullScreen?: boolean;
  loading?: boolean;
  msg?: IMsg;
  children: ReactNode;
}

export interface IMsg {
  active: boolean;
  severity: string;
  msg: string;
}
