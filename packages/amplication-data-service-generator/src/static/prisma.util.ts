const PRISMA_QUERY_INTERPRETATION_ERROR = "P2016";
const PRISMA_RECORD_NOT_FOUND = "RecordNotFound";

export function isRecordNotFoundError(error: Error): boolean {
  return (
    "code" in error &&
    error.code === PRISMA_QUERY_INTERPRETATION_ERROR &&
    error.message.includes(PRISMA_RECORD_NOT_FOUND)
  );
}
