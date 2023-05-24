export interface BuildLogger {
  /**
   * Log an info message
   * @param message  Log message
   * @param params Additional application internal log params. Not diplayed in the build log.
   * @param userFriendlyMessage  User facing log message. It will be displayed in the build log. Default: @param message
   * @returns
   */
  info: (
    message: string,
    params?: Record<string, unknown>,
    userFriendlyMessage?: string
  ) => Promise<void>;
  /**
   * Log a warning message
   * @param message  Log message
   * @param params Additional application internal log params. Not diplayed in the build log.
   * @param userFriendlyMessage  User facing log message. It will be displayed in the build log. Default: @param message
   * @returns
   */
  warn: (
    message: string,
    params?: Record<string, unknown>,
    userFriendlyMessage?: string
  ) => Promise<void>;
  /**
   * Log an error message
   * @param message  Log message
   * @param params Additional application internal log params. Not diplayed in the build log.
   * @param userFriendlyMessage  User facing log message. It will be displayed in the build log. Default: @param message
   * @param error Error
   * @returns
   */
  error: (
    message: string,
    params?: Record<string, unknown>,
    userFriendlyMessage?: string,
    error?: Error
  ) => Promise<void>;
}
