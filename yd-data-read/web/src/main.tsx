import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Web3Provider } from './components/Web3Provider.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000
    }
  }
})
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Web3Provider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Web3Provider>
  </StrictMode>
)
