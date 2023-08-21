/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    AZURE_AD_CLIENT_ID: 'e4b1d77c-047e-4555-9bf9-fed42d59aef7',
    AZURE_AD_CLIENT_SECRET: 'Bd48Q~cIgQH~ekPa1HjF4GOWEAj-yncdYhk8gcDn',
    AZURE_AD_TENANT_ID: '7bc6f172-9a65-4056-babd-0e815bd28c0d',
    NEXTAUTH_SECRET: 'rPXqbJktEXD6fmIE2bgLLXxoIyhWLrF6DUZpfLzkEAw=',
  },
}

module.exports = nextConfig
