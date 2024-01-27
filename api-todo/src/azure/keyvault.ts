import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

export const getSecretFromKeyVault = async (
  keyVaultEndpoint,
  keyVaultSecretName,
  logger
) => {
  if (!keyVaultEndpoint || !keyVaultSecretName) {
    throw new Error(
      'AZURE_KEY_VAULT_ENDPOINT or AZURE_KEY_VAULT_COSMOSDB_CONNECTION_STRING_KEY_NAME has not been set. Configuration will be loaded from current environment.'
    );
  }

  const credential = new DefaultAzureCredential({});
  const secretClient = new SecretClient(keyVaultEndpoint, credential);
  const secret = await secretClient.getSecret(keyVaultSecretName);

  logger.debug(`CONFIG: getConnectionStringFromKeyVault: ${secret.value}`);

  return secret.value;
};
