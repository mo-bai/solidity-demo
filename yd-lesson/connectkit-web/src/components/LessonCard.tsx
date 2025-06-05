import { useReadContract } from 'wagmi'
import { useYDToken } from '../hooks/useYDToken'
import { YD_COLLEGE_ADDRESS } from '../hooks/useYDCollege'
import { YDCollegeABI } from '../abi/YDCollege'

interface LessonCardProps {
  id: number
  name: string
  price: number
  cover: string
  purchased: boolean
  onPurchase: (lessonId: number) => void
  onExchangeYD: () => void
}

interface Lesson {
  id: number
  name: string
  description: string
  price: bigint
  cover: string
  link: string
}

export function LessonCard({
  id,
  name,
  price,
  cover,
  purchased,
  onPurchase,
  onExchangeYD
}: LessonCardProps) {
  const { balance, isBalanceLoading } = useYDToken()

  // 获取课程详情
  const { data: lesson, isLoading: isLessonLoading } = useReadContract({
    address: YD_COLLEGE_ADDRESS,
    abi: YDCollegeABI,
    functionName: 'getLesson',
    args: [id],
    query: {
      enabled: purchased
    }
  })

  const handleWatch = async () => {
    // 获取课程详情
    if (lesson && (lesson as Lesson).link) {
      window.open((lesson as Lesson).link, '_blank')
    }
  }

  const hasEnoughBalance = balance && balance >= BigInt(price)

  const handlePurchase = async () => {
    if (!hasEnoughBalance) {
      onExchangeYD()
    } else {
      onPurchase(id)
    }
  }

  return (
    <div className='overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm'>
      {/* 课程封面 */}
      <div className='relative p-4 aspect-square'>
        <img src={cover} alt={name} className='w-full h-full' />
      </div>

      {/* 课程信息 */}
      <div className='p-4'>
        <h3 className='mb-2 text-lg font-semibold truncate' title={name}>
          {name}
        </h3>
        <div className='flex justify-between items-center'>
          <div className='text-gray-600'>
            <span className='text-sm'>价格：</span>
            <span className='font-medium'>{price.toString()} YD</span>
          </div>
        </div>

        {/* 购买/兑换按钮 */}
        <div className='mt-4'>
          {purchased ? (
            <button
              className='px-4 py-2 w-full font-medium text-white bg-green-500 rounded-md disabled:opacity-50'
              onClick={handleWatch}>
              {isLessonLoading ? '加载中...' : '已购买，去观看'}
            </button>
          ) : (
            <div className='space-y-2'>
              <button
                onClick={handlePurchase}
                disabled={isBalanceLoading}
                className='px-4 py-2 w-full font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500'>
                {hasEnoughBalance ? '购买课程' : '余额不足，点击兑换'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
