import { Group } from "@/components/Group"
import { IconTick, IconClose } from "@douyinfe/semi-icons"
import { Banner, Tag } from "@douyinfe/semi-ui"

export const CertifyCard = ({ info: certifyInfo, onClose }: { info: Certify | null; onClose?: () => void }) => {
  return (
    <Banner
      fullMode={false}
      type={certifyInfo === null ? "warning" : "info"}
      bordered
      icon={null}
      closeIcon={onClose ? undefined : null}
      onClose={onClose}
      title={<div style={{ fontWeight: 600, fontSize: "14px", lineHeight: "20px" }}>实名信息</div>}
      description={
        certifyInfo !== null ? (
          <Group vertical>
            <Group>
              <div style={{ color: "var(--semi-color-text-2)" }}>真实姓名：</div>
              <div>{certifyInfo.realName}</div>
            </Group>
            <Group>
              <div style={{ color: "var(--semi-color-text-2)" }}>身份证号：</div>
              <div>{certifyInfo.realId}</div>
            </Group>
            <Group>
              <div style={{ color: "var(--semi-color-text-2)" }}>验证时间：</div>
              <div>{new Date(certifyInfo.createTime * 1000).toLocaleString()}</div>
            </Group>
            <Group>
              <div style={{ color: "var(--semi-color-text-2)" }}>验证结果：</div>
              <Tag
                color={certifyInfo.isPassed ? "green" : "red"}
                prefixIcon={certifyInfo.isPassed ? <IconTick /> : <IconClose />}
              >
                {certifyInfo.isPassed ? "验证通过" : "验证失败"}
              </Tag>
            </Group>
          </Group>
        ) : (
          "未查询到实名信息"
        )
      }
    />
  )
}
