/**
 * Copyright (c) Formium, Inc. and its affiliates.
 *
 * This source code is licensed under the Business Source License license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
interface Props {
  /**
   * The error message to display to the end-user.
   * Should be short yet descriptive of what they did wrong.
   */
  message: string;
  /**
   * A unique error code for this particular error.
   * Should start with the builder name such as `NODE_`.
   */
  code: string;
  /**
   * Optional hyperlink starting with https://formium.io to
   * link to more information about this error.
   */
  link?: string;
  /**
   * Optional "action" to display before the `link`, such as "Learn More".
   */
  action?: string;
}

/**
 * This error should be thrown from a Builder in
 * order to stop the build and print a message.
 * This is necessary to avoid printing a stack trace.
 */
export class FormiumBuildError extends Error {
  public hideStackTrace = true;
  public code: string;
  public link?: string;
  public action?: string;

  constructor({ message, code, link, action }: Props) {
    super(message);
    this.code = code;
    this.link = link;
    this.action = action;
  }
}
