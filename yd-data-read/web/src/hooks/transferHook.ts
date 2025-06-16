import type { Address } from 'viem'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { useEffect } from 'react'

/**
 * 给账户转账，转给黑洞和转给合约记录信息本质都是转账,
 * 合约中使用 fallback 函数保证交易不会报错，虽然报错也能上链
 */
export const useTransfer = () => {
  const {
    sendTransaction,
    isPending,
    error,
    data: hash,
    reset
  } = useSendTransaction()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt
  } = useWaitForTransactionReceipt({
    hash
  })

  const transfer = (to: Address, message: `0x${string}`) => {
    reset()
    try {
      sendTransaction({
        to: to,
        value: parseEther('0'),
        data: message
      })
    } catch (error) {
      console.error('发生内部错误:', error)
    }
  }

  useEffect(() => {
    console.log('isConfirmed:', isConfirmed)
    if (isConfirmed) {
      const timer = setTimeout(() => {
        reset()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isConfirmed, reset])

  return {
    transfer,
    isPending,
    hash,
    error,
    isConfirming,
    isConfirmed,
    receipt
  }
}
