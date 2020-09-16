import React from 'react';

/**
 * @public
 */
export interface BaseInputProps {
  /** The unique identifier of the question. */
  id: string;
  /** The administrative key for the field. */
  name: string;
  /** Whether or not the field is required. */
  required: boolean;
  /** Whether or not the field is disabled. */
  disabled: boolean;
  /** Change event handler. Use event.target.value for new value. */
  onChange: React.FormEventHandler;
  /** Event handler invoked when input is blurred. */
  onBlur: React.FormEventHandler;
  /** Event handler invoked when input is focused. */
  onFocus: React.FormEventHandler;
  /** Form value of the input, for controlled usage. */
  value: string;
  /** Input placeholder value */
  placeholder?: string;
}

/**
 * @public
 */
export interface TextInputProps extends BaseInputProps {
  /** HTML `input` type attribute. */
  type: string;
}

/**
 * @public
 */
export interface TextareaProps extends BaseInputProps {
  /** Number of `textarea` rows */
  rows: 5;
}

export const TextInput = React.memo<TextInputProps>(function TextInput(props) {
  return <input {...props} type="text" placeholder="Type your answer here" />;
});

export const Textarea = React.memo<TextareaProps>(function Textarea(props) {
  return <textarea {...props} rows={5} placeholder="Type your answer here" />;
});

/**
 * @public
 */
export interface ControlProps {
  /** Event handler invoked when input value is changed.  */
  onChange: React.FormEventHandler;
  /** Event handler invoked when input is blurred.  */
  onBlur: React.FormEventHandler;
  /** Whether the control is checked. */
  checked: boolean;
  /** Whether or not the field is disabled. */
  disabled: boolean;
  /** Text label for the control. */
  label: React.ReactNode;
  /** The administrative key for the field. */
  name: string;
  /** Value of the control. */
  value: string;
  /** Unique identifier of the control. */
  id: string;
}

export const Checkbox = React.memo<CheckboxProps>(function Checkbox(props) {
  return (
    <div>
      <input
        id={props.id}
        type="checkbox"
        value={props.value}
        checked={props.checked}
        onChange={props.onChange}
        onBlur={props.onBlur}
        disabled={props.disabled}
      />
      <label htmlFor={props.id}>{props.label}</label>
    </div>
  );
});

export const Radio = React.memo<RadioProps>(function Radio(props) {
  return (
    <div>
      <input
        id={props.id}
        type="radio"
        value={props.value}
        checked={props.checked}
        onChange={props.onChange}
        onBlur={props.onBlur}
        disabled={props.disabled}
      />
      <label htmlFor={props.id}>{props.label}</label>
    </div>
  );
});

/**
 * An interface for an option in a list, such as in a `<select>` or `RadioGroup`.
 * The idea is that these props can be spread directly to an `<option>` or `<Radio>` element.
 *
 * @public
 */
export interface OptionProps {
  /** Unique identifier of the option */
  id: string;
  /** Whether this option is non-interactive. */
  disabled?: boolean;

  /** Label text for this option. If omitted, `value` is used as the label. */
  label: string;

  /** Value of this option. */
  value: string | number;
}

/** @public */
export type RadioProps = ControlProps;

/** @public */
export type CheckboxProps = ControlProps;

/**
 * @public
 */
export interface RadioGroupProps {
  /** Unique identifier field. */
  id: string;
  /**
   * Whether the group and _all_ its radios are disabled.
   */
  disabled: boolean;

  /**
   * Whether the group is required.
   */
  required: boolean;

  /** Optional label text to display above the radio buttons. */
  // label?: React.ReactNode;

  /**
   * Name of the group (i.e. the administrative key), used to link radio buttons together in HTML.
   */
  name: string;

  /**
   * Callback invoked when the currently selected radio changes.
   * Use `event.target.value` to read the currently selected value.
   */
  onChange: (event: React.SyntheticEvent) => void;

  /**
   * Event handler invoked when input is blurred.
   */
  onBlur: (event: React.SyntheticEvent) => void;
  /**
   * Array of options to render in the group.
   */
  options: OptionProps[];

  /** Value of the selected radio. The child with this value will be `:checked`. */
  value: string;
}
