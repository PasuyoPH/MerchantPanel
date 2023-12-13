import LabelStyle from './Label.module.css'
import { Constants } from 'app-types'

interface LabelProps {
  text: string
  size?: number
  color?: string
  style?: 'italic' | 'normal'
  weight?: 'bold' | 'normal'
  containerStyle?: React.CSSProperties
}

const Label = (props: LabelProps) => {
  return (
    <div
      className={LabelStyle.container}
      style={
        {
          fontSize: props.size ?? 14,
          color: props.color ?? Constants.Colors.Text.tertiary,
          fontStyle: props.style ?? 'normal',
          fontWeight:  props.weight ?? 'normal',
          ...(props.containerStyle ?? {})
        }
      }
    >
      {props.text ?? ''}
    </div>
  )
}

export default Label