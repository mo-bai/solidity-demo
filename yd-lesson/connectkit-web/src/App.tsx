import { Web3Provider } from './Web3Provider'
import { ConnectKitButton } from 'connectkit'
import WalletInfo from './components/WalletInfo'
import { LessonList } from './LessonList'
import LessonManager from './components/LessonManager'

const App = () => {
  return (
    <Web3Provider>
      <div className='flex justify-between items-center p-3 w-full'>
        <WalletInfo />
        <ConnectKitButton />
      </div>
      <div className='p-3 w-full'>
        <LessonList />
      </div>
      <LessonManager />
    </Web3Provider>
  )
}

export default App
