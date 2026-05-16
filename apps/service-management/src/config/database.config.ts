import { ConfigService } from '@nestjs/config';

function normalizeDatabaseUrl(rawUrl?: string | null): string | undefined {
  if (!rawUrl) {
    return undefined;
  }

  const trimmedUrl = rawUrl.trim();
  if (trimmedUrl.startsWith('jdbc:')) {
    return trimmedUrl.slice(5);
  }

  return trimmedUrl;
}

export function resolveManagementDatabaseUrl(
  configService: ConfigService,
): string {
  const configuredUrl = normalizeDatabaseUrl(
    configService.get<string>('DATABASE_URL') ||
      configService.get<string>('DB_MANAGEMENT_URL'),
  );

  if (configuredUrl) {
    return configuredUrl;
  }

  const host = configService.get<string>('DB_HOST') || 'db-management';
  const port = configService.get<string>('DB_PORT') || '5432';
  const name = configService.get<string>('DB_NAME') || 'db_management';
  const user = configService.get<string>('DB_USER') || 'postgres';
  const password = configService.get<string>('DB_PASSWORD') || 'postgres_pass';

  return `postgresql://${user}:${password}@${host}:${port}/${name}`;
}