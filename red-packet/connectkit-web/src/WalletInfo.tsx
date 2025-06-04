import { useAccount, useBalance } from 'wagmi'

// 钱包信息组件
const WalletInfo = () => {
  const { address, isConnecting, isDisconnected } = useAccount()
  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address: address
  })

  // 没有使用状态管理，直接暴露到全局
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.refetchWalletBalance = refetchBalance
  }

  if (isConnecting)
    return (
      <div className='p-4 rounded-lg border border-gray-200 shadow-sm'>
        <div className='flex justify-center items-center h-24'>
          <div className='text-gray-600'>连接中...</div>
        </div>
      </div>
    )

  if (isDisconnected)
    return (
      <div className='p-4 rounded-lg border border-gray-200 shadow-sm'>
        <div className='flex justify-center items-center h-24'>
          <div className='text-gray-600'>请连接钱包</div>
        </div>
      </div>
    )

  return (
    <div className='p-4 rounded-lg border border-gray-200 shadow-sm'>
      <h2 className='mb-4 text-lg font-semibold'>钱包信息</h2>

      <div className='space-y-2'>
        <div>
          <span className='text-gray-600'>地址：</span>
          <span className='font-mono'>
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>

        <div>
          <span className='text-gray-600'>余额：</span>
          <span>
            {balanceData?.formatted} {balanceData?.symbol}
          </span>
        </div>
      </div>
    </div>
  )
}

export default WalletInfo
