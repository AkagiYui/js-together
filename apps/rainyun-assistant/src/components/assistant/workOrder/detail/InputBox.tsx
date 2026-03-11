import { ConfirmButton } from "@/components/ConfirmButton"
import { QuillEditor } from "@/components/QuillEditor"
import { useWorkOrderDetail } from "@/hooks"
import { IconBox, IconClear, IconClose, IconHash, IconHourglass, IconRefresh2, IconSend } from "@douyinfe/semi-icons"
import { Button, List, Resizable } from "@douyinfe/semi-ui"
import { useEffect, useState } from "react"

export const InputBox = ({ id: workOrderId }: { id: number }) => {
  const { data } = useWorkOrderDetail(workOrderId)

  const [value, setValue] = useState("")
  useEffect(() => {
    console.log("编辑器内容", value)
  }, [value])

  const data1 = [
    "从明天起，做一个幸福的人",
    "喂马，劈柴，周游世界",
    "从明天起，关心粮食和蔬菜",
    "我有一所房子，面朝大海，春暖花开",
  ]
  return (
    <>
      <Resizable
        enable={{
          top: true,
          left: false,
          right: false,
          bottom: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        minHeight={200}
        defaultSize={{ height: 220 }}
        className="z-0"
      >
        <div className="p-2 bg-[var(--semi-color-nav-bg)] h-full">
          <div className="flex gap-2 h-full">
            <div className="flex-1">
              <QuillEditor value={value} onChange={setValue} placeholder="请耐心交流，文明用语" />
            </div>
            <div className="flex-1 w-16">
              <List
                className="h-full"
                size="small"
                bordered
                dataSource={data1}
                renderItem={(item) => <List.Item className="cursor-pointer">{item}</List.Item>}
              />
            </div>
            <div className="flex flex-col gap-2 w-36">
              <Button disabled={data?.status === "finished" ? true : false} theme="solid" icon={<IconSend />}>
                回复
              </Button>
              <ConfirmButton disabled={data?.status === "finished" ? true : false} icon={<IconHourglass />}>
                挂起
              </ConfirmButton>
              <Button icon={<IconHash />}>话术表</Button>
              <Button icon={<IconBox />}>快捷查询</Button>

              <ConfirmButton
                type={data?.status === "finished" ? "primary" : "danger"}
                icon={data?.status === "finished" ? <IconRefresh2 /> : <IconClose />}
                className="mt-auto"
                confirmIcon={<IconClear />}
              >
                {data?.status === "finished" ? "重新打开" : "关闭工单"}
              </ConfirmButton>
            </div>
          </div>
        </div>
      </Resizable>
    </>
  )
}
