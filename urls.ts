export const baseUrl =
  'https://launch.smarthealthit.org/v/r4/sim/eyJoIjoiMSIsImoiOiIxIiwiZSI6ImVmYjVkNGNlLWRmZmMtNDdkZi1hYTZkLTA1ZDM3MmZkYjQwNyJ9'

export const discovery = {
  authorizationEndpoint: `${baseUrl}/auth/authorize`,
  tokenEndpoint: `${baseUrl}/auth/token`,
}

export const serverUrl = `${baseUrl}/fhir`
