import { Web3Provider } from './Web3Provider'
import { ConnectKitButton } from 'connectkit'
import WalletInfo from './WalletInfo'
import { RedPacket } from './RedPacket'

const App = () => {
  return (
    <Web3Provider>
      <div className='flex justify-end p-3 w-full'>
        <ConnectKitButton />
      </div>
      <div className='p-3 w-full'>
        {/* 钱包信息 */}
        <WalletInfo />
      </div>
      <div className='p-3 w-full'>
        <RedPacket />
      </div>
    </Web3Provider>
  )
}

export default App
