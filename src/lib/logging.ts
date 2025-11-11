export function logInfo(message: string, meta?: unknown) {
  const timestamp = new Date().toISOString();
  if (meta) {
    console.log(`[${timestamp}] INFO: ${message}`, meta);
  } else {
    console.log(`[${timestamp}] INFO: ${message}`);
  }
}

export function logError(message: string, meta?: unknown) {
  const timestamp = new Date().toISOString();
  if (meta) {
    console.error(`[${timestamp}] ERROR: ${message}`, meta);
  } else {
    console.error(`[${timestamp}] ERROR: ${message}`);
  }
}

export function logWarn(message: string, meta?: unknown) {
  const timestamp = new Date().toISOString();
  if (meta) {
    console.warn(`[${timestamp}] WARN: ${message}`, meta);
  } else {
    console.warn(`[${timestamp}] WARN: ${message}`);
  }
}
