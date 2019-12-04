import * as React from 'react'
import {Nav} from './Nav'
import { Layout } from 'antd';

const { Header } = Layout;

const HeaderSection: React.FunctionComponent = (
  props
): JSX.Element => {

  return (
    <Header className="header">
      <div className="logo" />
      <Nav/>
    </Header>
  );
};

export { HeaderSection };