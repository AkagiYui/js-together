import {
  faQuestion,
  faServer,
  faCube,
  faVectorSquare,
  faGamepad,
  faGlobe,
  faCircleNodes,
  faDatabase,
  faKey,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const ProductTypeIcon = ({ type }: { type: ProductType }) => {
  const iconMap = {
    "": [faQuestion, "w-16px pt-0.4 pl-1.2"],
    rvh: [faServer, "w-16px pt-0.4 pl-0.3"],
    rcs: [faCube, "w-16px pt-0.4 pl-0.3"],
    rbm: [faVectorSquare, "w-16px pt-0.4 pl-0.6"],
    rgs: [faGamepad, "w-16px pt-0.4 ml--0.3"],
    domain: [faGlobe, "w-16px pt-0.4 pl-0.3"],
    rcdn: [faCircleNodes, "w-16px pt-0.4 pl-0.3"],
    ros: [faDatabase, "w-16px pt-0.4 pl-0.5"],
    ssl: [faKey, "w-16px pt-0.4 pl-0.3"],
  } as const
  const iconInfo = iconMap[type]
  return <FontAwesomeIcon className={iconInfo[1]} icon={iconInfo[0]} size="lg" />
}
