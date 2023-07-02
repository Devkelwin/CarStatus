import React from 'react';
import {TouchableOpacityProps} from 'react-native';
import { Container } from './styles';
import { IconProps } from 'phosphor-react-native';
import theme from '../../theme';
export type IconBoxProps = (props: IconProps) => JSX.Element
type Props = TouchableOpacityProps & {
    icon: IconBoxProps
}
export function ButtonIcon({icon: Icon, ...rest}: Props) {

  return (
    <Container activeOpacity={0.7} {...rest}>
        <Icon 
        size={32}
        color={theme.COLORS.BRAND_MID}
        />
    </Container>
  );
}