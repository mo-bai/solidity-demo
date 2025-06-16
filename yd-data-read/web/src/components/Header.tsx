import { ConnectKitButton } from 'connectkit'
export default function Header() {
  return (
    <div className='flex justify-between items-center px-4 w-full h-16 bg-white'>
      <div className='flex gap-2 items-center'>
        <h1 className='text-2xl font-bold'>Data Read</h1>
      </div>
      <ConnectKitButton />
    </div>
  )
}
