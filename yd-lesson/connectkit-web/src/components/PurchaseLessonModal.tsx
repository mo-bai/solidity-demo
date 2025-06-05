import { useYDCollege } from '../hooks/useYDCollege'
import { useYDToken } from '../hooks/useYDToken'
import { useEffect, useState } from 'react'

interface PurchaseLessonModalProps {
  lessonId: number
  name: string
  price: bigint
  isOpen: boolean
  onClose: () => void
}

const YD_COLLEGE_ADDRESS = '0xaC1D3870c7Ce41d7Aaa9a690469188e4CBF9Dc53'

export function PurchaseLessonModal({
  lessonId,
  name,
  price,
  isOpen,
  onClose
}: PurchaseLessonModalProps) {
  const { buyLesson, isBuying, error: buyError } = useYDCollege()
  const {
    balance,
    approve,
    isApproveLoading,
    isBuyLoading,
    error: approveError
  } = useYDToken()
  const [step, setStep] = useState<'approve' | 'purchase'>('approve')
  const [isProcessing, setIsProcessing] = useState(false)

  // 监听授权状态变化，授权完成后自动进入购买步骤
  useEffect(() => {
    if (
      isProcessing &&
      step === 'approve' &&
      !isApproveLoading &&
      !approveError
    ) {
      // 授权完成，进入购买步骤
      setStep('purchase')
      setIsProcessing(false)
    }
  }, [isApproveLoading, approveError, step, isProcessing])

  // 监听购买状态变化，购买完成后关闭弹窗
  useEffect(() => {
    if (isProcessing && step === 'purchase' && !isBuying && !buyError) {
      // 购买完成，关闭弹窗
      onClose()
      setIsProcessing(false)
      setStep('approve') // 重置步骤，为下次打开做准备
      // @ts-ignore
      if (window._refetchBalance) {
        // @ts-ignore
        window._refetchBalance()
      }
    }
  }, [isBuying, buyError, step, isProcessing, onClose])

  // 处理错误
  useEffect(() => {
    if (buyError || approveError) {
      setIsProcessing(false)
      console.error('approveError', approveError)
      console.error('buyError', buyError)
    }
  }, [buyError, approveError])

  const handlePurchase = () => {
    if (isProcessing) return

    setIsProcessing(true)

    if (step === 'approve') {
      // 执行授权
      approve(YD_COLLEGE_ADDRESS, price)
    } else {
      // 执行购买
      buyLesson(lessonId)
    }
  }

  // 重置弹窗状态
  useEffect(() => {
    if (!isOpen) {
      setStep('approve')
      setIsProcessing(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const isCurrentStepLoading = () => {
    if (step === 'approve') return isApproveLoading
    if (step === 'purchase') return isBuying
    return false
  }

  const buttonText = () => {
    if (isCurrentStepLoading()) {
      return step === 'approve' ? '授权中...' : '购买中...'
    }
    return step === 'approve' ? '授权 YD 代币' : '确认购买'
  }

  const hasEnoughBalance = balance && balance >= price

  return (
    <div className='flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50'>
      <div className='m-4 w-full max-w-md bg-white rounded-lg shadow-xl'>
        <div className='p-6'>
          {/* 标题和关闭按钮 */}
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold'>购买课程</h2>
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

          {/* 课程信息 */}
          <div className='mb-6'>
            <h3 className='mb-2 text-lg font-semibold'>{name}</h3>
            <div className='text-gray-600'>
              <p>价格：{price.toString()} YD</p>
              <p>当前余额：{balance ? balance.toString() : '0'} YD</p>
            </div>
          </div>

          {/* 购买步骤提示 */}
          <div className='mb-6'>
            <div className='flex items-center mb-4'>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'approve'
                    ? 'bg-blue-500 text-white'
                    : 'bg-green-500 text-white'
                }`}>
                {step === 'approve' && isApproveLoading ? (
                  <div className='w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent'></div>
                ) : (
                  <span>1</span>
                )}
              </div>
              <div className='flex items-center ml-3'>
                <span>授权 YD 代币</span>
                {step !== 'approve' && (
                  <svg
                    className='ml-2 w-4 h-4 text-green-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className='flex items-center'>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'purchase' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}>
                {step === 'purchase' && isBuying ? (
                  <div className='w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent'></div>
                ) : (
                  <span>2</span>
                )}
              </div>
              <div className='ml-3'>确认购买</div>
            </div>
          </div>

          {/* 错误提示 */}
          {(buyError || approveError) && (
            <div className='p-3 mb-4 text-red-700 bg-red-100 rounded-md'>
              {buyError || approveError}
            </div>
          )}

          {/* 操作按钮 */}
          <button
            onClick={handlePurchase}
            disabled={isCurrentStepLoading() || !hasEnoughBalance}
            className='px-4 py-2 w-full text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500'>
            {!hasEnoughBalance ? 'YD 币余额不足' : buttonText()}
          </button>
        </div>
      </div>
    </div>
  )
}
