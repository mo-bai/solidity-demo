import {
  useReadContract,
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
  usePublicClient
} from 'wagmi'
import { parseEther } from 'viem'
import { YDLessonTokenABI } from '../abi/YDLessonToken'
import { useEffect, useState } from 'react'

// 替换为你部署的合约地址
const YD_TOKEN_ADDRESS = '0xA8BDfd853d6C6AeEef5Afca8C20feA3a9E277252'

export function useYDToken() {
  const { address, isConnecting, isDisconnected, isConnected } = useAccount()
  const publicClient = usePublicClient()

  const [innerState, setInnerState] = useState<{
    action: 'buying' | 'approving' | ''
    error?: string
  }>({
    action: '',
    error: undefined
  })
  // 读取代币余额
  const {
    data: balance,
    isLoading: isBalanceLoading,
    refetch: refetchBalance
  } = useReadContract({
    address: YD_TOKEN_ADDRESS,
    abi: YDLessonTokenABI,
    functionName: 'balanceOf',
    args: [address!],
    query: {
      enabled: !!address
    }
  })

  const { writeContract, data: hash, error: writeError } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash
    })

  // 购买代币
  const buyTokens = async (ethAmount: string) => {
    setInnerState({
      action: 'buying',
      error: undefined
    })
    writeContract({
      address: YD_TOKEN_ADDRESS,
      abi: YDLessonTokenABI,
      functionName: 'buyTokens',
      value: parseEther(ethAmount)
    })
  }

  // 授权代币给课程合约
  const approve = async (spenderAddress: string, amount: bigint) => {
    setInnerState({
      action: 'approving',
      error: undefined
    })
    writeContract({
      address: YD_TOKEN_ADDRESS,
      abi: YDLessonTokenABI,
      functionName: 'approve',
      args: [spenderAddress, amount]
    })
  }

  useEffect(() => {
    if (writeError) {
      setInnerState({
        action: '',
        error: writeError.message || '操作失败'
      })
    }
  }, [writeError])

  useEffect(() => {
    const checkTransaction = async () => {
      if (hash && isConfirmed && publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({ hash })
        if (receipt.status === 'success') {
          refetchBalance()
        }
        setInnerState({
          action: '',
          error: undefined
        })
      }
    }
    checkTransaction()
  }, [hash, isConfirmed, innerState.action, address, publicClient])

  return {
    balance: balance as bigint,
    isBalanceLoading,
    isConnecting,
    isDisconnected,
    isConnected,
    isBuyLoading: innerState.action === 'buying',
    isApproveLoading: innerState.action === 'approving',
    isLoading: innerState.action !== '',
    error: innerState.error,
    buyTokens,
    approve,
    refetchBalance
  }
}
