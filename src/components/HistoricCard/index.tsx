import React from 'react';
import { Container, Departure, Info, LicensePlate } from './styles';
import { TouchableOpacityProps } from 'react-native';
import { Check, ClockClockwise } from 'phosphor-react-native';
import { useTheme } from 'styled-components';
export type HistoryCardProps = {
    id: string
    created: string
    licensePlate: string
    isSync: boolean
}
type Props = TouchableOpacityProps & {
    data: HistoryCardProps
}
export function HistoricCard({data,...rest}: Props) {
    const {COLORS} = useTheme()
  return (
    <Container {...rest}>
        <Info>
            <LicensePlate>
                {data.licensePlate}
            </LicensePlate>
            
            <Departure>
                {data.created}
            </Departure>
        </Info>
        {
            data.isSync ?
            <Check
            size={24}
            color={COLORS.BRAND_LIGHT}
            />
            :
            <ClockClockwise
            color={COLORS.GRAY_400}
            size={24}
            />
        }

    </Container>
  );
}