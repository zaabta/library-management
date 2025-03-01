export const formatValidationErrors = (errors: any[]): string => {
  return errors
    .map((err) => `Field: ${err.path.join('.')} - ${err.message}`)
    .join(', ')
}
