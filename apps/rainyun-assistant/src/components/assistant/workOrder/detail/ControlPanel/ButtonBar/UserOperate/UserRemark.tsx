import { userRemarkAtom } from "@/stores"
import { TextArea } from "@douyinfe/semi-ui"
import { useAtom } from "jotai"

export const UserRemark = ({ userId }: { userId: number }) => {
  const [remark, setRemark] = (() => {
    const [userRemark, setUserRemark] = useAtom(userRemarkAtom)
    return [
      userRemark[userId],
      (remark: string) => {
        setUserRemark((prev) => {
          if (remark) {
            return { ...prev, [userId]: remark }
          }
          const { [userId]: _, ...rest } = prev
          return rest
        })
      },
    ]
  })()

  return (
    <div>
      <TextArea
        value={remark}
        onChange={setRemark}
        autosize
        rows={1}
        placeholder="用户备注（离线记录，不跟随雨云账号）"
        className="w-full"
        showClear
      />
    </div>
  )
}
