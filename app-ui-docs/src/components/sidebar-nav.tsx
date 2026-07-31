import { Link, type LinkProps } from "@tanstack/react-router";
import { componentGroups } from "./component-groups";

type SidebarNavProps = {
  /** 点击导航项后的回调（窄屏 Sheet 抽屉中用于关闭） */
  onNavigate?: () => void;
};

/** 生成文件的组件名即注册路由名，此处按 Link 的 to 类型收窄。 */
function routeOf(name: string) {
  return `/${name}` as LinkProps["to"];
}

/** 按分组渲染的侧栏导航：桌面侧栏与窄屏抽屉共用。 */
export function SidebarNav({ onNavigate }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-5 text-sm">
      <Link to="/" onClick={onNavigate} className="block px-2 text-base font-semibold text-foreground">
        @akagiyui/ui-react
      </Link>
      {componentGroups.map((group) => (
        <div key={group.title}>
          <h3 className="flex items-baseline gap-1.5 px-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {group.title}
            <span className="font-normal normal-case text-muted-foreground/70">{group.items.length}</span>
          </h3>
          <div className="mt-1 flex flex-col gap-0.5">
            {group.items.map((name) => (
              <Link
                key={name}
                to={routeOf(name)}
                onClick={onNavigate}
                className="rounded px-2 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                activeProps={{ className: "bg-accent text-foreground" }}
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
