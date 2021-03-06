import styled from 'styled-components';

import Icon from '../Icon';

export const NotificationWrapper = styled.div`
  box-shadow: 0 0 4px 0 #00000026, 0 12px 20px 0 #00000019;
  border: 0;
  width: auto;
  max-width: 450px;
  background: #fff;
  position: fixed;
  top: 25px;
  right: ${props => (props.visible ? '30' : '-1000')}px;
  transition: all ease-in-out 0.4s;
  z-index: 1000;
  cursor: pointer;
  border-radius: 3px;
  border-left: ${props => (props.color ? `6px solid ${props.color}` : 'none')};
`;

export const NotificationHeader = styled.div`
  font-family: '72';
  font-size: 13px;
  line-height: 1.31;
  font-weight: bold;
  text-align: left;
  color: #32363a;
  position: relative;
  padding: 12px 12px;
  box-sizing: border-box;
  position: relative;
`;
export const NotificationBody = styled.div`
  font-family: '72';
  font-size: 13px;
  line-height: 1.31;
  font-weight: normal;
  text-align: left;
  color: #32363a;
  position: relative;
  padding: 12px 12px;
  box-sizing: border-box;
  position: relative;
`;

export const NotificationTitleWrapper = styled.span`
  margin-right: 32px;
  display: inline-block;
`;

export const NotificationIconWrapper = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 12px;
`;
