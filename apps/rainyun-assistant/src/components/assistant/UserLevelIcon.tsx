import {
  faCloud,
  faCloudRain,
  faCloudShowersHeavy,
  faCloudSun,
  faCloudSunRain,
  faSun,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const UserLevelIcon = ({ level }: { level: UserLevel }) => {
  const iconMap = {
    0: [faCloud, "#84888d"],
    1: [faCloudRain, "#05d0e8"],
    2: [faCloudShowersHeavy, "#3bb6c2"],
    3: [faCloudSun, "#ffa147"],
    4: [faCloudSunRain, "#ffa147"],
    5: [faSun, "#ea5758"],
  } as const
  if (!iconMap[level]) {
    return null
  }
  const [icon, color] = iconMap[level]
  return <FontAwesomeIcon icon={icon} size="lg" color={color} />
}
