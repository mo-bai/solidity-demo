import { useEffect, useState } from 'react'
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  usePublicClient
} from 'wagmi'

import { WriteContractErrorType } from 'wagmi/actions'

// 合约信息
const redPacketContract = {
  address: '0xC35FE4C8F6eE1e44802C4934c313d6fB903398F4',
  abi: [
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_count',
          type: 'uint256'
        },
        {
          internalType: 'bool',
          name: '_isEqual',
          type: 'bool'
        }
      ],
      stateMutability: 'payable',
      type: 'constructor'
    },
    {
      inputs: [],
      name: 'count',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'currentRound',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'isEqual',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        },
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'isGrabbed',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [
        {
          internalType: 'address payable',
          name: '',
          type: 'address'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'totalAmount',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '_count',
          type: 'uint256'
        },
        {
          internalType: 'bool',
          name: '_isEqual',
          type: 'bool'
        }
      ],
      name: 'deposit',
      outputs: [],
      stateMutability: 'payable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'withdraw',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'geBalance',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'grabRedPacket',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ]
} as const

export function RedPacket() {
  const { address, isConnected } = useAccount()
  const [depositAmount, setDepositAmount] = useState('')
  const [loading, setLoading] = useState('')
  const [packetCount, setPacketCount] = useState<number | ''>(1)
  const [isEqual, setIsEqual] = useState(true)
  // 抢到的金额
  const [grabbedAmount, setGrabbedAmount] = useState<string>('')
  const [error, setError] = useState<string>('')
  // 抢红包前的余额
  const [balanceBeforeGrab, setBalanceBeforeGrab] = useState<bigint | null>(
    null
  )
  // 公用客户端，用于获取区块信息
  const publicClient = usePublicClient()

  // 查询合约数据
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: redPacketContract.address,
    abi: redPacketContract.abi,
    functionName: 'geBalance'
  })

  const { data: remainingCount, refetch: refetchCount } = useReadContract({
    address: redPacketContract.address,
    abi: redPacketContract.abi,
    functionName: 'count'
  })

  // 查询合约所有者
  const { data: owner } = useReadContract({
    address: redPacketContract.address,
    abi: redPacketContract.abi,
    functionName: 'owner'
  })

  // 判断当前用户是否是合约所有者
  const isOwner =
    address && owner && address.toLowerCase() === owner.toLowerCase()

  // 抢红包合约调用
  const { writeContract, data: hash, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash
    })

  const errorHandler = (simulateError: WriteContractErrorType) => {
    let errorMessage = '操作失败'
    const errorString = simulateError.message || JSON.stringify(simulateError)
    console.log('模拟调用错误：', simulateError)

    if (errorString.includes('AlreadyGrabbed')) {
      errorMessage = '您已经抢过红包了'
    } else if (errorString.includes('NoMoreRedPackets')) {
      errorMessage = '红包已经被抢完了'
    } else if (errorString.includes('InsufficientBalance')) {
      errorMessage = '红包余额不足'
    } else if (errorString.includes('user rejected')) {
      errorMessage = '您取消了交易'
    }

    setError(errorMessage)
  }
  // 监听交易错误
  useEffect(() => {
    if (writeError) {
      setLoading('')
      // 解析错误信息
      errorHandler(writeError)
    }
  }, [writeError])

  // 监听交易状态
  useEffect(() => {
    const checkTransaction = async () => {
      console.log('checkTransaction', hash, isConfirmed, publicClient)
      if (hash && isConfirmed && publicClient) {
        try {
          // 获取交易收据
          const receipt = await publicClient.getTransactionReceipt({ hash })

          // 如果是抢红包交易
          if (loading === 'grabbing' && balanceBeforeGrab && address) {
            // 获取交易后的余额
            const balanceAfterGrab = await publicClient.getBalance({
              address: address
            })

            // 计算 gas 费用
            const gasUsed = receipt.gasUsed * receipt.effectiveGasPrice

            // 计算实际抢到的金额 = 余额增加 + gas费用
            const grabbedWei = balanceAfterGrab - balanceBeforeGrab + gasUsed
            console.log('grabbedWei', grabbedWei)
            if (grabbedWei > 0) {
              setGrabbedAmount((Number(grabbedWei) / 1e18).toFixed(4))
              setTimeout(() => {
                setGrabbedAmount('')
              }, 5000)
            }

            // 清除记录的余额
            setBalanceBeforeGrab(null)
          }

          // 刷新红包余额和数量
          refetchBalance()
          refetchCount()

          // 刷新用户钱包余额
          // @ts-ignore
          if (window.refetchWalletBalance) {
            // @ts-ignore
            await window.refetchWalletBalance()
          }

          // 重置状态
          setLoading('')

          // 如果是存入操作，清空表单
          if (loading === 'depositing') {
            setDepositAmount('')
            setPacketCount(1)
          }
        } catch (err) {
          setLoading('')
        }
      }
    }

    checkTransaction()
  }, [hash, isConfirmed, loading, address, publicClient, balanceBeforeGrab])

  const grabRedPacket = async () => {
    setError('')
    try {
      // 先进行模拟调用，检查是否会出错
      if (address && publicClient) {
        try {
          await publicClient.simulateContract({
            address: redPacketContract.address,
            abi: redPacketContract.abi,
            functionName: 'grabRedPacket',
            account: address
          })
        } catch (simulateError: any) {
          console.log('simulateError', simulateError)
          // 解析模拟调用的错误
          errorHandler(simulateError)
          return
        }
        // 记录抢红包前的余额
        const balance = await publicClient.getBalance({
          address: address
        })
        setBalanceBeforeGrab(balance)
      }

      // 设置loading
      setLoading('grabbing')
      // 如果模拟成功，执行实际调用
      writeContract({
        address: redPacketContract.address,
        abi: redPacketContract.abi,
        functionName: 'grabRedPacket'
      })
    } catch (err) {
      setError('调用合约失败')
      setLoading('')
    }
  }

  const deposit = () => {
    if (!depositAmount || !packetCount) return
    setError('')
    setLoading('depositing')
    try {
      writeContract({
        address: redPacketContract.address,
        abi: redPacketContract.abi,
        functionName: 'deposit',
        args: [BigInt(packetCount), isEqual],
        value: BigInt(parseFloat(depositAmount) * 1e18)
      })
    } catch (err) {
      setError('调用合约失败')
      setLoading('')
    }
  }

  const withdraw = () => {
    if (!isOwner) return
    setError('')
    setLoading('withdrawing')
    try {
      writeContract({
        address: redPacketContract.address,
        abi: redPacketContract.abi,
        functionName: 'withdraw'
      })
    } catch (err) {
      setError('提取失败')
      setLoading('')
    }
  }

  if (!isConnected) return null

  return (
    <div className='p-4 rounded-lg border border-gray-200 shadow-sm'>
      <div className='space-y-4'>
        <h2 className='text-xl font-bold text-gray-800'>红包操作</h2>

        {/* 错误信息展示 */}
        {error && (
          <div className='p-3 text-red-700 bg-red-50 rounded-lg'>{error}</div>
        )}

        {/* 红包信息展示 */}
        <div className='p-4 space-y-2 bg-gray-50 rounded-lg'>
          <p className='text-gray-700'>
            当前余额: {balance ? (Number(balance) / 1e18).toFixed(4) : '0'} ETH
          </p>
          <p className='text-gray-700'>
            剩余红包数量: {remainingCount ? Number(remainingCount) : '0'} 个
          </p>
        </div>

        {/* 抢红包部分 */}
        <div className='space-y-2'>
          <button
            onClick={() => grabRedPacket()}
            disabled={loading === 'grabbing' || isConfirming}
            className='px-4 py-2 w-full text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50'>
            {loading === 'grabbing' || isConfirming ? '抢红包中...' : '抢红包'}
          </button>
          {grabbedAmount && !error && (
            <div className='p-3 mt-2 text-green-700 bg-green-50 rounded-lg'>
              恭喜！抢到 {grabbedAmount} ETH
            </div>
          )}
        </div>

        {/* 存钱部分 */}
        <div className='space-y-2'>
          <input
            type='number'
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder='输入存入金额（ETH）'
            className='p-2 w-full rounded-lg border border-gray-300'
          />
          <input
            type='number'
            value={packetCount}
            onChange={(e) =>
              setPacketCount(e.target.value ? parseInt(e.target.value) : '')
            }
            placeholder='红包数量'
            min='1'
            className='p-2 w-full rounded-lg border border-gray-300'
          />
          <div className='flex items-center mb-2 space-x-2'>
            <input
              type='checkbox'
              checked={isEqual}
              onChange={(e) => setIsEqual(e.target.checked)}
              className='rounded'
            />
            <label className='text-sm text-gray-700'>等额红包</label>
          </div>
          <button
            onClick={() => deposit()}
            disabled={
              loading === 'depositing' ||
              isConfirming ||
              !depositAmount ||
              !packetCount
            }
            className='px-4 py-2 w-full text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50'>
            {loading === 'depositing' || isConfirming ? '存入中...' : '存入'}
          </button>
        </div>

        {/* 取款部分 - 只有合约所有者可见 */}
        {isOwner && (
          <div className='space-y-2'>
            <button
              onClick={() => withdraw()}
              disabled={loading === 'withdrawing' || isConfirming}
              className='px-4 py-2 w-full text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 disabled:opacity-50'>
              {loading === 'withdrawing' || isConfirming
                ? '提取中...'
                : '提取所有资金'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
