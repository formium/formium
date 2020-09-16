import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MuiRadio from '@material-ui/core/Radio';
import MuiCheckbox from '@material-ui/core/Checkbox';
import MuiFormControl from '@material-ui/core/FormControl';
import MuiFormHelperText from '@material-ui/core/FormHelperText';
import MuiFormLabel from '@material-ui/core/FormLabel';
import Box from '@material-ui/core/Box';
import MuiInput from '@material-ui/core/Input';
import MuiButton from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

const Radio = ({ value, label, name, checked, onChange, id }) => {
  return (
    <FormControlLabel
      label={label}
      control={
        <MuiRadio
          id={id}
          checked={checked}
          value={value}
          name={name}
          onChange={onChange}
        />
      }
    />
  );
};

const Checkbox = ({ value, label, name, checked, onChange, id }) => {
  return (
    <FormControlLabel
      label={label}
      control={
        <MuiCheckbox
          id={id}
          checked={checked}
          value={value}
          name={name}
          onChange={onChange}
        />
      }
    />
  );
};

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
    <Box my={6}>
      <MuiFormControl
        error={error}
        disabled={disabled}
        required={required}
        fullWidth={true}
      >
        <MuiFormLabel htmlFor={labelFor}>{label}</MuiFormLabel>
        {children}
        {error && (
          <MuiFormHelperText id={labelFor} disabled={disabled} error={true}>
            {error}
          </MuiFormHelperText>
        )}
        {description && (
          <MuiFormHelperText id={labelFor} disabled={disabled} error={false}>
            {description}
          </MuiFormHelperText>
        )}
      </MuiFormControl>
    </Box>
  );
};

const SubmitButton = props => (
  <MuiButton variant="contained" color="primary" size="large" {...props} />
);

const NextButton = props => (
  <MuiButton variant="contained" color="primary" size="large" {...props} />
);

const PreviousButton = props => (
  <MuiButton variant="contained" color="secondary" size="large" {...props} />
);

const PageWrapper = props => {
  return (
    <Container maxWidth="sm">
      <Box>{props.children}</Box>
    </Container>
  );
};

const Textarea = props => <MuiInput multiline={true} rows={5} {...props} />;

export const FormiumMUI = {
  SubmitButton,
  PreviousButton,
  NextButton,
  TextInput: MuiInput,
  Textarea,
  FormControl,
  Radio,
  PageWrapper,
  Checkbox,
};
