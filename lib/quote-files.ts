export const MAX_QUOTE_FILES = 3;
export const MAX_QUOTE_FILE_BYTES = 4 * 1024 * 1024;
export const QUOTE_FILE_ACCEPT = ".pdf,.png,.jpg,.jpeg,.doc,.docx";

const allowedQuoteFileExtension = /\.(pdf|png|jpe?g|docx?)$/i;

export function isAllowedQuoteFile(filename: string): boolean {
  return allowedQuoteFileExtension.test(filename);
}
