import type { ValidationError } from 'class-validator';

export function formatValidationErrors(errors: ValidationError[]): string {
  const messages: string[] = [];

  const walk = (error: ValidationError, parentPath = '') => {
    const path = parentPath ? `${parentPath}.${error.property}` : error.property;

    if (error.constraints) {
      for (const value of Object.values(error.constraints)) {
        messages.push(`${path}: ${value}`);
      }
    }

    for (const child of error.children ?? []) {
      walk(child, path);
    }
  };

  for (const error of errors) {
    walk(error);
  }

  return messages.join('|');
}

export function parseErrorMessage(rawMessage: string): Record<string, string[]> {
  if (!rawMessage.includes(':')) {
    return {};
  }

  return rawMessage.split('|').reduce<Record<string, string[]>>((accumulator, part) => {
    const [field, ...rest] = part.split(':');
    if (!field || rest.length === 0) {
      return accumulator;
    }

    const key = field.trim();
    const value = rest.join(':').trim();

    if (!accumulator[key]) {
      accumulator[key] = [];
    }

    accumulator[key].push(value);
    return accumulator;
  }, {});
}