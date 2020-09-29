/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Form, FormElement, FormElementType } from '@formium/client';
import { canUseDOM } from '@formium/utils';
import {
  Field,
  Form as FormikForm,
  FormikConfig,
  FormikContext,
  FormikValues,
  useFormik,
  useFormikContext,
} from 'formik';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Yup from 'yup';
import { useIsomorphicLayoutEffect } from './utils/useIsomorphicLayoutEffect';
import { unstable_FormiumLogic as FormiumLogic } from './FormiumLogic';
import {
  Checkbox,
  ControlProps,
  Radio,
  RadioGroupProps,
  Textarea,
  TextareaProps,
  TextInput,
  TextInputProps,
} from './inputs';
import { useStorage } from './utils/useSessionStorage';

const SubmitButton: React.FC<JSX.IntrinsicElements['button']> = (props) => {
  return <button type="submit" {...props} />;
};

const NextButton: React.FC<JSX.IntrinsicElements['button']> = (props) => {
  return <button type="button" {...props} />;
};

function Header({
  page: page,
  pageIndex: pageIndex,
}: {
  page: FormElement;
  pageIndex: number;
}) {
  return (
    <>
      {page.title ? (
        pageIndex === 0 ? (
          <h1>{page.title}</h1>
        ) : (
          <h2>{page.title}</h2>
        )
      ) : null}
      {page.description ? <p>{page.description}</p> : null}
    </>
  );
}

/**
 * Formium Form options
 * @public
 */
export interface FormiumFormProps<V> {
  /**
   * A Formium Form (returned from an API Client)
   */
  data: Form;
  /**
   * Submission callback handler. This function is called when the
   * form is valid and a submission is attempted by pressing
   * the submit button on the last page of the form.
   */
  onSubmit: (values: V) => Promise<void>;
  /**
   * Custom component overrides. When specified, these will be used
   * instead of the default components for rendering respective inputs.
   *
   * @default defaultComponents
   */
  components?: FormiumComponents;
}

export interface FormiumComponents {
  SubmitButton: React.ComponentType<JSX.IntrinsicElements['button']>;
  PreviousButton: React.ComponentType<JSX.IntrinsicElements['button']>;
  NextButton: React.ComponentType<JSX.IntrinsicElements['button']>;
  Header: any;
  PageWrapper: any;
  ElementsWrapper: any;
  FooterWrapper: any;
  FieldWrapper: any;
  FormControl: React.ComponentType<FormControlProps>;
  TextInput: React.ComponentType<TextInputProps>;
  Textarea: React.ComponentType<TextareaProps>;
  Checkbox: React.ComponentType<ControlProps>;
  Radio: React.ComponentType<ControlProps>;
  RadioGroup?: React.ComponentType<RadioGroupProps>;
}

export interface FormControlProps {
  /**
   * Whether field should appear as non-interactive.
   * Remember that `input` elements must be disabled separately.
   */
  disabled: boolean;

  /**
   * Whether field is required
   */
  required: boolean;

  /**
   * Label of this field.
   */
  label?: React.ReactNode;

  /**
   * `id` attribute of the field that this `FormControl` controls,
   * used as `<label htmlFor>` attribute.
   */
  labelFor?: string;

  /**
   * Optional helper text.
   */
  description?: React.ReactNode;

  /**
   * Error message (if present) and the current field has been visited, otherwise this will be undefined.
   */
  error?: React.ReactNode;

  /**
   * React children. This is where actual field implementation will be rendered.
   */
  children?: React.ReactNode;
}

const FormControl = React.memo<FormControlProps>(function FormControl({
  children,
  description,
  error,
  label,
  labelFor,
}) {
  return (
    <div>
      {label && <label htmlFor={labelFor}>{label}</label>}
      {description && <div>{description}</div>}
      {children}
      {error && <div>{error}</div>}
    </div>
  );
});

export const defaultComponents = {
  SubmitButton,
  NextButton,
  PreviousButton: NextButton,
  Header,
  ElementsWrapper: ({ children }: any) => children,
  PageWrapper: ({ children }: any) => children,
  FooterWrapper: ({ children }: any) => children,
  FieldWrapper: (props: any) => <div {...props} />,
  FormControl,
  TextInput,
  Textarea,
  Radio,
  Checkbox,
};

const Page: React.FC<any> = ({ children }) => children;

Page.displayName = 'FormiumPage';

/**
 * Return the list of "input" elements from a form. This is every element
 * except for Groups, Pages, and Choices.
 *
 * @param form A formium form
 * @public
 * @alpha
 */
export const getElementsFromForm = (form?: Form) => {
  if (!form) {
    return [];
  }
  if (!form.schema?.fields) {
    return [];
  }

  return Object.values(form.schema.fields).filter(
    (i) =>
      i.type !== FormElementType.GROUP &&
      i.type !== FormElementType.PAGE &&
      i.type !== FormElementType.CHOICE
  );
};

/**
 * Return a Yup object schema based on a list of form elements.
 *
 * @param inputElements - An array of expanded FormElements
 * @returns A Yup schema
 * @public
 * @alpha
 */
export function getValidationSchema(inputElements?: FormElement[]) {
  return Yup.object(
    inputElements &&
      inputElements.reduce((prev: any, curr: any) => {
        let validation;
        if (curr.hidden) {
          return prev;
        }
        // @todo make this a switch
        if (curr.type === FormElementType.CHECKBOX) {
          validation = Yup.array().of(Yup.string());
        } else if (
          curr.type === FormElementType.RADIO &&
          curr.children &&
          curr.children.length > 0
        ) {
          validation = Yup.string();
          if (!curr.allowOther) {
            validation = validation.oneOf(
              curr.children.map((c: any) => c.title)
            );
          }
        } else if (
          curr.type === FormElementType.SHORT_TEXT ||
          curr.type === FormElementType.LONG_TEXT
        ) {
          validation = Yup.string();
          if (curr.maxLength) {
            validation = validation.max(
              curr.maxLength,
              `Must be less than ${curr.maxLength}`
            );
          }
        } else if (curr.type === FormElementType.EMAIL) {
          validation = Yup.string().email('Invalid email');
          if (curr.maxLength) {
            validation = validation.max(
              curr.maxLength,
              `Must be less than ${curr.maxLength} characters`
            );
          }
        } else if (curr.type === FormElementType.PHONE_NUMBER) {
          validation = Yup.string();
          if (curr.maxLength) {
            validation = validation.max(
              curr.maxLength,
              `Must be less than ${curr.maxLength} characters`
            );
          }
        } else if (curr.type === FormElementType.DATE) {
          validation = Yup.date();
        } else if (curr.type === FormElementType.TIME) {
          validation = Yup.string();
        } else if (curr.type === FormElementType.URL) {
          validation = Yup.string().url('Invalid URL');
          if (curr.maxLength) {
            validation = validation.max(
              curr.maxLength,
              `Must be less than ${curr.maxLength} characters`
            );
          }
        } else if (curr.type === FormElementType.BOOLEAN) {
          validation = Yup.boolean();
        } else if (curr.type === FormElementType.NUMBER) {
          validation = Yup.number();
          if (curr.minValue) {
            validation = validation.min(
              curr.minValue,
              `Must be greater than ${curr.minValue}`
            );
          }
          if (curr.maxValue) {
            validation = validation.max(
              curr.maxValue,
              `Must be less than ${curr.maxValue}`
            );
          }
        }

        if (curr.required) {
          // @todo fix type
          validation = (validation as any).required(
            curr.requiredText ?? 'This question requires an answer.'
          );
        }

        // @todo fix type
        (prev as any)[curr.slug] = validation;
        return prev;
      }, {})
  );
}

type NestedField = FormElement & { children?: FormElement[] };

/**
 * Return initial values given an array of form elements (i.e. like on a page)
 *
 * @param inputElements - An array of expanded FormElements
 * @typeParam Values - The shape of the values of your form (an object with keys matching those specified in the dashboard)
 * @returns Initial values for the array of elements / page. This does not include values set by dynamic population.
 * @public
 */
export function getInitialValues<Values>(inputElements: FormElement[]): Values {
  return inputElements.reduce((prev: any, curr: FormElement) => {
    if (curr.type === FormElementType.CHECKBOX) {
      (prev as any)[curr.slug] = [];
    } else {
      (prev as any)[curr.slug] = curr.defaultValue ?? '';
    }
    return prev;
  }, {} as Values);
}

function denormalize(arr: string[], get: (id: string) => any): NestedField[] {
  return (
    arr &&
    arr.map((id) => {
      const el = get(id);
      return {
        ...el,
        ...(el.items && el.items.length > 0
          ? { children: denormalize(el.items, get) }
          : {}),
      };
    })
  );
}

const FormControlWrapper = React.memo<
  {
    component: FormiumComponents['FormControl'];
    name: string;
  } & FormControlProps
>(({ component: Comp, name, ...props }) => {
  const formik = useFormikContext();
  const { error, touched } = formik.getFieldMeta(name);
  return <Comp {...props} error={!!touched && !!error && error} />;
});

/**
 * @public
 */
export function FormiumForm<Values extends FormikValues = FormikValues>({
  data: _data,
  components = defaultComponents,
  ...props
}: FormiumFormProps<Values>) {
  const [form, setForm] = React.useState<Form>(_data);
  const children = denormalize(
    form?.schema?.pageIds ?? [],
    (id: string) => form?.schema?.fields[id]
  );
  const initialValues: Values = getInitialValues(getElementsFromForm(form));
  const setFieldProperty = React.useCallback(
    (id: string, partial: Partial<FormElement>) => {
      setForm((f) => ({
        ...f,
        schema: {
          ...(f.schema ?? {}),
          fields: {
            ...(f.schema?.fields ?? {}),
            [id]: {
              ...(f.schema?.fields[id] ?? {}),
              ...partial,
            } as FormElement,
          },
        },
      }));
    },
    [setForm]
  );

  return (
    <FormikWizard
      components={components}
      initialValues={initialValues}
      data={_data}
      {...props}
    >
      {children &&
        children.map((page: NestedField, pageIndex: number) => (
          <Page
            key={page.id}
            validationSchema={getValidationSchema(
              children![pageIndex].children!
            )}
          >
            <components.PageWrapper>
              <components.Header
                form={form}
                page={page}
                pageIndex={pageIndex}
              />
              <components.ElementsWrapper>
                {page.children &&
                  page.children.map((element: NestedField, index: number) => {
                    const {
                      id,
                      children,
                      actions,
                      items,
                      hidden,
                      required,
                      requiredText,
                      defaultValue,
                      placeholder,
                      ...item
                    } = element;
                    if (hidden) {
                      return null;
                    }
                    return (
                      <components.FieldWrapper key={id}>
                        <FormiumLogic
                          form={form}
                          element={element}
                          setFieldProperty={setFieldProperty}
                        />

                        {item.type === FormElementType.SHORT_TEXT ? (
                          <FormControlWrapper
                            required={!!required}
                            label={item.title!}
                            labelFor={id}
                            name={item.slug}
                            description={item.description}
                            component={components.FormControl}
                            disabled={false}
                          >
                            <Field
                              as={components.TextInput}
                              name={item.slug}
                              placeholder={placeholder}
                              required={required}
                              disabled={false}
                              id={id}
                              type="text"
                            />
                          </FormControlWrapper>
                        ) : item.type === FormElementType.EMAIL ? (
                          <FormControlWrapper
                            required={!!required}
                            label={item.title!}
                            labelFor={id}
                            name={item.slug}
                            description={item.description}
                            component={components.FormControl}
                            disabled={false}
                          >
                            <Field
                              as={components.TextInput}
                              name={item.slug}
                              placeholder={placeholder}
                              required={required}
                              id={id}
                              type="email"
                            />
                          </FormControlWrapper>
                        ) : item.type === FormElementType.URL ? (
                          <FormControlWrapper
                            required={!!required}
                            label={item.title!}
                            labelFor={id}
                            name={item.slug}
                            description={item.description}
                            component={components.FormControl}
                            disabled={false}
                          >
                            <Field
                              as={components.TextInput}
                              name={item.slug}
                              placeholder={placeholder}
                              required={required}
                              id={id}
                              type="url"
                            />
                          </FormControlWrapper>
                        ) : item.type === FormElementType.RADIO ? (
                          <FormControlWrapper
                            required={!!required}
                            label={item.title!}
                            labelFor={id}
                            name={item.slug}
                            description={item.description}
                            component={components.FormControl}
                            disabled={false}
                          >
                            {components.RadioGroup ? (
                              <Field
                                as={components.RadioGroup}
                                id={id}
                                name={item.slug}
                                required={!!required}
                                disabled={false}
                                options={
                                  children &&
                                  children.length > 0 &&
                                  children.map((c) => ({
                                    id: c.id,
                                    disabled: false,
                                    label: c.title,
                                    value: c.title,
                                  }))
                                }
                              />
                            ) : (
                              <>
                                {children &&
                                  children.length > 0 &&
                                  children.map((c: any) => (
                                    <div key={c.id}>
                                      <Field
                                        as={components.Radio}
                                        value={c.title}
                                        label={c.title}
                                        type="radio"
                                        name={item.slug}
                                        id={c.id}
                                      />
                                    </div>
                                  ))}
                              </>
                            )}
                          </FormControlWrapper>
                        ) : item.type === FormElementType.CHECKBOX ? (
                          <>
                            <FormControlWrapper
                              required={!!required}
                              label={item.title!}
                              labelFor={id}
                              name={item.slug}
                              description={item.description}
                              component={components.FormControl}
                              disabled={false}
                            >
                              {children &&
                                children.length > 0 &&
                                children.map((c: any) => (
                                  <div key={c.id}>
                                    <Field
                                      as={components.Checkbox}
                                      role="checkbox"
                                      value={c.title}
                                      label={c.title}
                                      type="checkbox"
                                      name={item.slug}
                                      id={c.id}
                                    />
                                  </div>
                                ))}
                            </FormControlWrapper>
                          </>
                        ) : item.type === FormElementType.LONG_TEXT ? (
                          <FormControlWrapper
                            required={!!required}
                            label={item.title!}
                            labelFor={id}
                            name={item.slug}
                            description={item.description}
                            component={components.FormControl}
                            disabled={false}
                          >
                            <Field
                              as={components.Textarea}
                              name={item.slug}
                              placeholder={placeholder}
                              required={required}
                              id={id}
                            />
                          </FormControlWrapper>
                        ) : null}
                      </components.FieldWrapper>
                    );
                  })}
              </components.ElementsWrapper>
            </components.PageWrapper>
          </Page>
        ))}
    </FormikWizard>
  );
}
const getFormPageStorageKey = (id: string) => `formium-${id}-form-page`;
const getFormStateStorageKey = (id: string) => `formium-${id}-form-state`;

function FormikWizard<Values extends FormikValues = FormikValues>({
  initialValues,
  children,
  onSubmit,
  components = defaultComponents,
  debug,
  ...props
}: FormikConfig<Values> &
  FormiumFormProps<Values> & {
    debug?: boolean;
  }) {
  const { id } = props.data;
  const pageStorageKey = React.useMemo(() => getFormPageStorageKey(id), [id]);
  const stateStorageKey = React.useMemo(() => getFormStateStorageKey(id), [id]);
  const [page, setPage] = useStorage(pageStorageKey, 0);
  const [values, setValues] = React.useState(initialValues || {});
  const next = React.useCallback(
    (newValues) => {
      if (children) {
        ReactDOM.unstable_batchedUpdates(() => {
          setPage((p) =>
            Math.min(p + 1, React.Children.toArray(children).length - 1)
          );
          setValues(newValues);
        });
      }
    },
    [setPage, setValues, children]
  );
  const previous = React.useCallback(() => {
    setPage((p) => Math.max(p - 1, 0));
  }, [setPage]);

  const validationSchema = React.useCallback(
    (v) => {
      const activePage: any = React.Children.toArray(children)[page];
      return activePage.props.validationSchema
        ? activePage.props.validationSchema
        : {};
    },
    [children, page]
  );

  const handleSubmit = React.useCallback(
    async (currentValues, formikActions) => {
      const isLastPage = page === React.Children.count(children) - 1;

      if (isLastPage) {
        return onSubmit(currentValues).then(() => {
          sessionStorage.removeItem(pageStorageKey);
          sessionStorage.removeItem(stateStorageKey);
        });
      } else {
        formikActions.setTouched({});
        next(currentValues);
        return;
      }
    },
    [onSubmit, children, next, page]
  );
  const activePage = React.Children.toArray(children)[page];
  const isLastPage = page === React.Children.count(children) - 1;
  const formik = useFormik({
    initialValues: values as any,
    onSubmit: handleSubmit,
    // enableReinitialize: true,
    validationSchema,
    ...props,
  });

  const {
    setFormikState,
    values: formikValues,
    touched,
    errors,
    initialValues: formikInitialValues,
  } = formik;

  React.useEffect(() => {
    if (canUseDOM()) {
      sessionStorage.setItem(
        stateStorageKey,
        JSON.stringify({
          values: formikValues,
          touched,
          errors,
          initialValues: formikInitialValues,
        })
      );
    }
  }, [formikValues, touched, errors, formikInitialValues, stateStorageKey]);

  useIsomorphicLayoutEffect(() => {
    try {
      const maybeF = sessionStorage.getItem(stateStorageKey);
      if (maybeF) {
        const newState = JSON.parse(maybeF);
        setFormikState(newState);
      }
    } catch (_error) {}
  }, [setFormikState, stateStorageKey]);

  return (
    <FormikContext.Provider value={formik}>
      <FormikForm>
        <>
          <components.PageWrapper>
            {activePage}
            <components.FooterWrapper>
              {page > 0 && (
                <components.PreviousButton type="button" onClick={previous}>
                  Back
                </components.PreviousButton>
              )}
              {!isLastPage && (
                <components.NextButton
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Next
                </components.NextButton>
              )}
              {isLastPage && (
                <components.SubmitButton
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Submit
                </components.SubmitButton>
              )}
              {debug ? (
                <>
                  <pre style={{ marginTop: 12, fontSize: 11 }}>
                    {JSON.stringify(formik, null, 2)}
                  </pre>
                  <pre style={{ fontSize: 11 }}>
                    {JSON.stringify({ isLastPage }, null, 2)}
                  </pre>
                </>
              ) : null}
            </components.FooterWrapper>
          </components.PageWrapper>
        </>
      </FormikForm>
    </FormikContext.Provider>
  );
}

FormikWizard.displayName = 'FormiumFormWizard';
