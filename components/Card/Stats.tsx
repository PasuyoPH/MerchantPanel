import { Constants } from 'app-types'
import StatsStyle from './Stats.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
import Label from '../Text/Label'
import Header from '../Text/Header'

interface StatsCardIconProps {
  main: IconDefinition
  secondary?: IconDefinition
}

interface StatsCardProps {
  value: number
  label: string
  color?: string

  icon?: StatsCardIconProps
}

const StatsCard = (props: StatsCardProps) => {
  return (
    <div className={StatsStyle.container}>
      <div
        className={StatsStyle.content}
        style={
          {
            backgroundColor: Constants.Colors.Text.alt
          }
        }
      >
        <div
          className={StatsStyle.textContent}
        >
          <FontAwesomeIcon
            icon={props.icon?.main ?? faQuestionCircle}
            color={props.color ?? Constants.Colors.All.main}
            style={{ fontSize: 32 }}
          />
        
          <div
            className={StatsStyle.numbers}
          >
            <Header
              text={(props.value ?? 0).toLocaleString()}
            />

            <Label
              text={props.label ?? 'No Label'}
              color={Constants.Colors.Text.secondary}
              size={12}
            />
          </div>
        </div>

        <FontAwesomeIcon
          icon={props.icon?.secondary ?? faQuestion}
          color={props.color ?? Constants.Colors.All.main}
          style={{ fontSize: 48 }}
        />
      </div>
    </div>
  )
}

export default StatsCard