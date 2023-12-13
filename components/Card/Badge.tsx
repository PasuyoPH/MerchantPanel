import { Constants } from 'app-types'
import BadgeStyle from './Badge.module.css'
import Label from '../Text/Label'

interface BadgeTextProps {
  content: string
  color?: string
  bold?: boolean
}

interface BadgeProps {
  color?: string
  text: BadgeTextProps
}

const Badge = (props: BadgeProps) => {
  return (
    <div
      className={BadgeStyle.container}
      style={
        { backgroundColor: props.color ?? Constants.Colors.All.main }
      }
    >
      <Label
        text={props.text?.content}
        weight={
          typeof props.text?.bold === 'boolean' ? 
            props.text?.bold ? 'bold' : 'normal' :
            'bold'
        }
        color={props.text?.color ?? Constants.Colors.Text.alt}
        size={12}
      />
    </div>
  )
}

export default Badge