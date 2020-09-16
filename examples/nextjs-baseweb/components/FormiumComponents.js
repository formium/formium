import * as React from 'react';
import { FormControl as BaseWebFormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Textarea } from 'baseui/textarea';
import { defaultComponents } from '@formium/react';
import { Heading, HeadingLevel } from 'baseui/heading';
import { Checkbox } from 'baseui/checkbox';
import { Block } from 'baseui/block';
import {
  RadioGroup as BaseWebRadioGroup,
  Radio as BaseWebRadio,
} from 'baseui/radio';
import { Button, KIND, SIZE } from 'baseui/button';

const FormControl = ({
  children,
  label,
  labelFor,
  error,
  disabled,
  required,
  description,
}) => {
  return (
    <BaseWebFormControl
      htmlFor={labelFor}
      label={label}
      error={error}
      disabled={disabled}
      caption={description}
    >
      <>{children}</>
    </BaseWebFormControl>
  );
};

const Header = ({ page }) => (
  <HeadingLevel>
    <Heading styleLevel={3}>{page.title}</Heading>
  </HeadingLevel>
);

const SubmitButton = props => <Button size={SIZE.large} {...props} />;

const NextButton = props => <Button size={SIZE.large} {...props} />;

const PreviousButton = props => (
  <Button size={SIZE.large} kind={KIND.secondary} {...props} />
);

const RadioGroup = ({ options, id, value, name, onChange }) => {
  return (
    <BaseWebRadioGroup id={id} value={value} name={name} onChange={onChange}>
      {options.map(option => (
        <BaseWebRadio
          id={option.id}
          key={option.id}
          name={name}
          value={option.value}
        >
          {option.label}
        </BaseWebRadio>
      ))}
    </BaseWebRadioGroup>
  );
};

const PageWrapper = ({ children }) => (
  <Block maxWidth="30rem" margin="0 auto">
    {children}
  </Block>
);

const FooterWrapper = ({ children }) => (
  <Block display="flex" alignItems="center" justifyContent="space-between">
    {children}
  </Block>
);
export const FormiumBaseWebComponents = {
  ...defaultComponents,
  PageWrapper,
  FooterWrapper,
  Header,
  FormControl,
  Checkbox,
  RadioGroup,
  TextInput: Input,
  Textarea,
  SubmitButton,
  NextButton,
  PreviousButton,
};
