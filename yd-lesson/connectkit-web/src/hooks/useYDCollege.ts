import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { YDCollegeABI } from '../abi/YDCollege'
import { useEffect, useState } from 'react'

interface LessonListItem {
  id: number
  name: string
  description: string
  price: bigint
  cover: string
  purchased: boolean
}

interface LessonCreate {
  name: string
  description: string
  price: bigint
  cover: string
  link: string
}

export const YD_COLLEGE_ADDRESS = '0xaC1D3870c7Ce41d7Aaa9a690469188e4CBF9Dc53'
export function useYDCollege() {
  const { address } = useAccount()
  // 上线的课程列表
  const {
    data: lessons,
    refetch: refetchLessons,
    error: lessonsError
  } = useReadContract({
    address: YD_COLLEGE_ADDRESS,
    abi: YDCollegeABI,
    functionName: 'getActiveLessons',
    args: [address || '']
  })

  // 获取课程总数
  // const { data: lessonCount } = useReadContract({
  //   address: YD_COLLEGE_ADDRESS,
  //   abi: YDCollegeABI,
  //   functionName: 'lessonCount'
  // })

  // console.log('lessonCount', lessonCount)

  // 获取所有课程
  // const { data: allLessons } = useReadContract({
  //   address: YD_COLLEGE_ADDRESS,
  //   abi: YDCollegeABI,
  //   functionName: 'lessons'
  // })

  // console.log('allLessons', allLessons)

  // 获取合约owner
  const { data: owner } = useReadContract({
    address: YD_COLLEGE_ADDRESS,
    abi: YDCollegeABI,
    functionName: 'owner'
  })

  useEffect(() => {
    if (lessonsError) {
      console.error('获取课程列表失败', lessonsError)
    }
    console.log('lessons', lessons)
  }, [lessonsError, lessons])

  // 获取用户购买的课程列表
  const { data: purchasedLessons } = useReadContract({
    address: YD_COLLEGE_ADDRESS,
    abi: YDCollegeABI,
    functionName: 'getUserPurchasedLessons',
    args: [address]
  })

  const publicClient = usePublicClient()

  const [innerState, setInnerState] = useState<{
    action: 'buying' | 'adding' | 'deleting' | ''
    error?: string
  }>({
    action: '',
    error: undefined
  })

  // 购买课程
  const { writeContract, error: writeError, data: hash } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash
    })
  const buyLesson = async (lessonId: number) => {
    setInnerState({
      action: 'buying',
      error: undefined
    })
    writeContract({
      address: YD_COLLEGE_ADDRESS,
      abi: YDCollegeABI,
      functionName: 'purchaseLesson',
      args: [lessonId]
    })
  }

  // 添加课程
  const addLesson = async (lesson: LessonCreate) => {
    setInnerState({
      action: 'adding',
      error: undefined
    })
    writeContract({
      address: YD_COLLEGE_ADDRESS,
      abi: YDCollegeABI,
      functionName: 'addLesson',
      args: [
        lesson.name,
        lesson.description,
        lesson.price,
        lesson.link,
        lesson.cover
      ]
    })
  }

  // 删除课程
  const deleteLesson = async (lessonId: number) => {
    setInnerState({
      action: 'deleting',
      error: undefined
    })
    writeContract({
      address: YD_COLLEGE_ADDRESS,
      abi: YDCollegeABI,
      functionName: 'deleteLesson',
      args: [lessonId]
    })
  }

  useEffect(() => {
    if (writeError) {
      console.error('writeError', writeError)
      let errorMessage = '操作失败'
      const errorString = writeError.message || JSON.stringify(writeError)
      if (errorString.includes('user rejected')) {
        errorMessage = '您取消了交易'
      } else if (errorString.includes('Insufficient YD tokens')) {
        errorMessage = '余额不足'
      } else if (errorString.includes('Lesson already purchased')) {
        errorMessage = '您已经购买过该课程'
      }

      setInnerState({
        action: '',
        error: errorMessage
      })
    }
  }, [writeError])

  useEffect(() => {
    const checkTransaction = async () => {
      if (hash && isConfirmed && publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({ hash })
        if (receipt.status === 'success') {
          refetchLessons()
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
    isOwner: address && address === owner,
    lessons: (lessons as LessonListItem[]) || [],
    purchasedLessons: purchasedLessons as LessonListItem[],
    isBuying: innerState.action === 'buying',
    isAdding: innerState.action === 'adding',
    error: innerState.error,
    buyLesson,
    addLesson,
    deleteLesson
  }
}
