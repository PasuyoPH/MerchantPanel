import HeaderStyle from './Header.module.css'
import { Constants } from 'app-types'
import Label from './Label'

interface HeaderProps {
  text: string
  size?: number
  color?: string
  label?: string
}

const Header = (props: HeaderProps) => {
  return (
    <div
      className={HeaderStyle.container}
      style={
        {
          fontSize: props.size ?? 32,
          color: props.color ?? Constants.Colors.Text.tertiary
        }
      }
    >
      {props.text ?? ''}

      {
        props.label ? (
          <Label
            text={props.label}
            color={Constants.Colors.Text.secondary}
            style='italic'
          />
        ) : null
      }
    </div>
  )
}

export default Header