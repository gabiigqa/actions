import { SecretClient } from '@azure/keyvault-secrets'
import { ClientSecretCredential } from '@azure/identity'
import dotenv from 'dotenv'

dotenv.config()

const { AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_KEY_VAULT_URL, AZURE_CLIENT_SECRET } = process.env
const tenantId = AZURE_TENANT_ID ?? ''
const clientId = AZURE_CLIENT_ID ?? ''
const keyVaultUrl = AZURE_KEY_VAULT_URL ?? ''
const clientSecret = AZURE_CLIENT_SECRET ?? ''

export const secretsCache: Record<string, string> = {}

export const preloadKeyVaultSecrets = async (): Promise<void> => {
  if (!keyVaultUrl || !tenantId || !clientId || !clientSecret) {
    console.warn('Azure Key Vault: configuración incompleta, se omitirá la precarga de secretos')
    return
  }
  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret)

  try {
    const client = new SecretClient(keyVaultUrl, credential)

    for await (const page of client.listPropertiesOfSecrets().byPage()) {
      for await (const secretProperties of page) {
        const name = secretProperties?.name
        try {
          const secret = await client.getSecret(name)
          const value = secret.value ?? ''
          secretsCache[name] = value
        } catch (err: any) {
          console.warn(`Azure Key Vault: no se pudo obtener el secreto '${name}':`, err.message ?? err)
        }
      }
    }

    console.log(`Azure Key Vault: precargados ${Object.keys(secretsCache).length} secretos`)
  } catch (err: any) {
    console.warn('Azure Key Vault: error durante la precarga de secretos:', err.message ?? err)
  }
}