import { useYDToken } from '../hooks/useYDToken'
import { useState, useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'

interface ExchangeYdCoinModalProps {
  isOpen: boolean
  onClose: () => void
}

const EXCHANGE_RATE = 10000 // 1 ETH = 10000 YD

export function ExchangeYdCoinModal({
  isOpen,
  onClose
}: ExchangeYdCoinModalProps) {
  const { balance: ydBalance, buyTokens, isBuyLoading, error } = useYDToken()
  const { address } = useAccount()
  const { data: ethBalance } = useBalance({
    address: address
  })

  const [ethAmount, setEthAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // 计算预期获得的YD币数量
  const expectedYdAmount = ethAmount
    ? (parseFloat(ethAmount) * EXCHANGE_RATE).toString()
    : '0'

  // 监听购买状态
  useEffect(() => {
    if (isProcessing && !isBuyLoading && !error) {
      // 兑换成功，关闭弹窗
      setEthAmount('')
      setIsProcessing(false)
      onClose()
    }
  }, [isBuyLoading, error, isProcessing, onClose])

  // 处理错误
  useEffect(() => {
    if (error) {
      setIsProcessing(false)
      console.error('Exchange error:', error)
    }
  }, [error])

  const handleExchange = async () => {
    if (!ethAmount || parseFloat(ethAmount) <= 0) return

    setIsProcessing(true)
    try {
      await buyTokens(ethAmount)
    } catch (err) {
      console.error('Exchange failed:', err)
      setIsProcessing(false)
    }
  }

  // 重置状态当弹窗关闭时
  useEffect(() => {
    if (!isOpen) {
      setEthAmount('')
      setIsProcessing(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const hasEnoughEth =
    ethBalance &&
    parseFloat(ethAmount || '0') <= parseFloat(ethBalance.formatted)
  const isValidAmount = ethAmount && parseFloat(ethAmount) > 0.0001 // 最小兑换金额
  const canExchange = hasEnoughEth && isValidAmount && !isProcessing

  return (
    <div className='flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50'>
      <div className='m-4 w-full max-w-md bg-white rounded-lg shadow-xl'>
        <div className='p-6'>
          {/* 标题和关闭按钮 */}
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold'>兑换 YD 币</h2>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className='text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-6 h-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          {/* 兑换比例展示 */}
          <div className='p-4 mb-6 bg-blue-50 rounded-lg'>
            <div className='text-center'>
              <h3 className='mb-2 text-lg font-semibold text-blue-800'>
                兑换比例
              </h3>
              <div className='text-2xl font-bold text-blue-600'>
                1 ETH = {EXCHANGE_RATE.toLocaleString()} YD
              </div>
              <p className='mt-1 text-sm text-blue-600'>
                最小兑换金额：0.0001 ETH
              </p>
            </div>
          </div>

          {/* 用户余额信息 */}
          <div className='mb-6 space-y-2'>
            <div className='flex justify-between text-gray-600'>
              <span>ETH 余额：</span>
              <span>
                {ethBalance ? parseFloat(ethBalance.formatted).toFixed(4) : '0'}{' '}
                ETH
              </span>
            </div>
            <div className='flex justify-between text-gray-600'>
              <span>YD 余额：</span>
              <span>{ydBalance ? ydBalance.toString() : '0'} YD</span>
            </div>
          </div>

          {/* 兑换输入 */}
          <div className='mb-6'>
            <label className='block mb-2 text-sm font-medium text-gray-700'>
              输入 ETH 数量
            </label>
            <div className='relative'>
              <input
                type='number'
                value={ethAmount}
                onChange={(e) => setEthAmount(e.target.value)}
                disabled={isProcessing}
                className='px-3 py-2 w-full rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
                placeholder='0.0001'
                min='0.0001'
                step='0.0001'
              />
              <div className='absolute top-2 right-3 text-gray-500'>ETH</div>
            </div>

            {/* 预期获得的YD币 */}
            {ethAmount && parseFloat(ethAmount) > 0 && (
              <div className='p-3 mt-2 bg-green-50 rounded-md'>
                <div className='text-sm text-green-700'>
                  预期获得：
                  <span className='font-semibold'>
                    {parseFloat(expectedYdAmount).toLocaleString()} YD
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 错误提示 */}
          {error && (
            <div className='p-3 mb-4 text-red-700 bg-red-100 rounded-md'>
              {error}
            </div>
          )}

          {/* 警告信息 */}
          {ethAmount && parseFloat(ethAmount) <= 0.0001 && (
            <div className='p-3 mb-4 text-yellow-700 bg-yellow-100 rounded-md'>
              兑换金额必须大于 0.0001 ETH
            </div>
          )}

          {/* 兑换按钮 */}
          <button
            onClick={handleExchange}
            disabled={!canExchange || isBuyLoading}
            className='flex justify-center items-center px-4 py-2 w-full text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500'>
            {isBuyLoading ? (
              <>
                <div className='mr-2 w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent'></div>
                兑换中...
              </>
            ) : (
              '确认兑换'
            )}
          </button>

          {/* 温馨提示 */}
          <div className='mt-4 text-xs text-center text-gray-500'>
            * 兑换需要支付 Gas 费用
            <br />* 兑换成功后 YD 币将自动添加到您的余额
          </div>
        </div>
      </div>
    </div>
  )
}
