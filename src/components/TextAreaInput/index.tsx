import React, { forwardRef } from 'react';
import { Container, Input, Label } from './styles';
import { TextInput, TextInputProps } from 'react-native';
import { useTheme } from 'styled-components/native';


type Props = TextInputProps & {
    label: string
}
const TextAreaInput = forwardRef<TextInput,Props>(({label,...rest},ref )  => {
    const theme = useTheme()
  return (
    <Container>
        <Label>
            {label}
        </Label>
        <Input 
        ref={ref}
        placeholderTextColor={theme.COLORS.GRAY_400} 
        multiline
        autoCapitalize="sentences"
        
        {...rest}
        />
    </Container>
  );
})

export {TextAreaInput};