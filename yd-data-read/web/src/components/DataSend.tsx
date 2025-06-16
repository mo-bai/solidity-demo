import { useEffect, useMemo, useState } from 'react'
import { stringToHex, hexToString } from 'viem'
import { useTransfer } from '../hooks/transferHook'
import {
  usePublicClient,
  useWaitForTransactionReceipt,
  // useWatchContractEvent,
  useWriteContract
} from 'wagmi'
import { dataSendAbi } from '../abis/dataSendAbi'

const sendTypeList = [
  {
    label: '给黑洞转账',
    value: 'sendToBlackHole'
  },
  {
    label: '给合约转账',
    value: 'sendToContract'
  },
  {
    label: '事件记录',
    value: 'eventRecord'
  }
]
const blackHoleAddress = '0x0000000000000000000000000000000000000000'
const contractAddress = '0x97385873623e65a22d361Eb4252b63E19c19060E'

export default function DataSend() {
  const [activeSendType, setActiveSendType] = useState(sendTypeList[0].value)
  const [dataContent, setDataContent] = useState('')
  const { transfer, isPending, hash, isConfirming, isConfirmed } = useTransfer()
  const client = usePublicClient()
  // 查询交易传递的消息
  const [info, setInfo] = useState({
    blockNumber: '',
    input: ''
  })

  const [latestEvent, setLatestEvent] = useState({
    user: '',
    data: '',
    blockNumber: '',
    blockHash: ''
  })

  // 使用 client 监听事件
  useEffect(() => {
    if (client) {
      const unwatch = client.watchContractEvent({
        address: contractAddress,
        abi: dataSendAbi,
        eventName: 'DataSet',
        onLogs: (logs) => {
          console.log('DataSet', logs)
          const latestLog = logs[0] as unknown as {
            args: { user: string; data: string }
            blockNumber: number
            blockHash: string
          }
          setLatestEvent({
            user: latestLog.args.user,
            data: latestLog.args.data,
            blockNumber: logs[0].blockNumber?.toString() || '',
            blockHash: logs[0].blockHash || ''
          })
        }
      })
      return () => unwatch()
    }
  }, [client])

  const transformData = useMemo(() => {
    // 文本转为十六进制
    return stringToHex(dataContent)
  }, [dataContent])

  const {
    writeContract,
    data: writeHash,
    isPending: writePending,
    reset: writeReset,
    error: writeError
  } = useWriteContract()
  const { isLoading: writeConfirming, isSuccess: writeConfirmed } =
    useWaitForTransactionReceipt({
      hash: writeHash
    })

  // 这个 hook 无效
  // useWatchContractEvent({
  //   address: contractAddress,
  //   abi: dataSendAbi,
  //   eventName: 'DataSet',
  //   enabled: true,
  //   onLogs(logs) {
  //     console.log('New logs!', logs)
  //   },
  //   onError: (error) => {
  //     console.error('❌ 全局事件监听错误:', error)
  //   }
  // })

  useEffect(() => {
    if (writeError) {
      console.log('writeError:', writeError)
    }
  }, [writeError])

  useEffect(() => {
    console.log('writeConfirmed:', writeConfirmed)
    if (writeConfirmed) {
      const timer = setTimeout(() => {
        writeReset()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [writeConfirmed, writeReset])

  const sendData = () => {
    if (activeSendType === 'sendToBlackHole') {
      // 给黑洞转账
      transfer(blackHoleAddress, transformData)
    } else if (activeSendType === 'sendToContract') {
      // 给合约转账
      transfer(contractAddress, transformData)
    } else if (activeSendType === 'eventRecord') {
      // 事件记录
      writeContract({
        abi: dataSendAbi,
        address: contractAddress,
        functionName: 'setData',
        args: [transformData]
      })
    }
  }

  const loadingMsg = useMemo(() => {
    if (isPending) {
      return '交易中...'
    }
    if (isConfirming) {
      return '交易确认中...'
    }
    if (isConfirmed) {
      return '交易成功'
    }
    if (writePending) {
      return '写合约中...'
    }
    if (writeConfirming) {
      return '写合约确认中...'
    }
    if (writeConfirmed) {
      return '写合约成功'
    }
    return ''
  }, [
    isPending,
    isConfirming,
    isConfirmed,
    writePending,
    writeConfirming,
    writeConfirmed
  ])

  useEffect(() => {
    if (client && hash) {
      const getInfo = async () => {
        const transaction = await client.getTransaction({
          hash: hash
        })
        if (transaction.input) {
          console.log('transaction:', transaction, transaction.input)
          setInfo({
            blockNumber: transaction.blockNumber.toString(),
            input: transaction.input
          })
        }
      }
      getInfo()
    }
  }, [client, hash])

  const changeSendType = (value: string) => {
    setActiveSendType(value)
    setDataContent('')
    setInfo({
      blockNumber: '',
      input: ''
    })
  }

  return (
    <div className='p-4 mt-4 w-full bg-gray-100'>
      <h1>数据上链</h1>
      <div className='flex gap-x-2 mt-4 w-full item-center'>
        {sendTypeList.map((item) => (
          <SendTypeButton
            key={item.value}
            {...item}
            active={activeSendType === item.value}
            onClick={changeSendType}
          />
        ))}
      </div>
      <div className='flex gap-x-2 items-center mt-4 w-full'>
        <label>数据内容</label>
        <input
          value={dataContent}
          onChange={(e) => setDataContent(e.target.value)}
          type='text'
          className='px-4 py-1 w-1/2 h-8 bg-white rounded-md'
        />
      </div>
      <div className='flex gap-x-2 items-center mt-4 w-full'>
        <label>转换后数据:</label>
        <span>{transformData}</span>
      </div>
      <div className='mt-4'>
        <button
          onClick={sendData}
          className='px-4 py-2 h-10 text-white bg-blue-500 rounded-md cursor-pointer'>
          {loadingMsg ? loadingMsg : '发送数据'}
        </button>
      </div>
      {activeSendType === 'eventRecord' ? (
        <div className='mt-4'>
          <h2>监听到的最新事件信息: </h2>
          <span>
            区块号:{latestEvent.blockNumber}
            <br />
            区块哈希:{latestEvent.blockHash}
            <br />
            用户地址:{latestEvent.user}
            <br />
            数据:{hexToString(latestEvent.data as `0x${string}`)}
          </span>
        </div>
      ) : (
        <div className='mt-4'>
          <span>
            本次交易信息:{' '}
            {info.input &&
              `blockNumber-${info.blockNumber} ，交易消息-${info.input}`}
          </span>
        </div>
      )}
    </div>
  )
}

type SendTypeButtonProps = {
  label: string
  value: string
  active: boolean
  onClick: (value: string) => void
}
function SendTypeButton({
  label,
  value,
  active,
  onClick
}: SendTypeButtonProps) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`w-max cursor-pointer h-10 rounded-md py-1 px-4 text-sm ${
        active ? 'text-white bg-blue-500' : 'text-gray-500 bg-gray-200'
      }`}>
      {label}
    </button>
  )
}
