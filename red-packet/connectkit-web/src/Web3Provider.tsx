import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import React from 'react'

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    // chains: [mainnet],
    // transports: {
    // RPC URL for each chain
    // [mainnet.id]: http(
    //   `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
    // ),
    // },
    // 本地链配置
    chains: [
      {
        id: 1337,
        name: 'Ganache',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: {
          default: { http: ['http://127.0.0.1:7545'] },
          public: { http: ['http://127.0.0.1:7545'] }
        }
      }
    ],

    // Required API Keys
    walletConnectProjectId: '',

    // Required App Info
    appName: 'Red Packet',

    // Optional App Info
    appDescription: 'Red Packet',
    appUrl: 'https://family.co', // your app's url
    appIcon: 'https://family.co/logo.png' // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
)

const queryClient = new QueryClient()

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
