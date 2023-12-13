import { Constants } from 'app-types'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Label from '../Text/Label'
import { animated, useSpring } from '@react-spring/web'

interface ImageProps {
  width?: number
  height?: number
  source?: string
}

interface InvertedProps {
  color?: string // main color to use
  secondaryColor?: string
  forceFill?: boolean // whether or not to forcefully just fill this value ignoring all transitions
}

interface TextProps {
  color?: string
  size?: number
  content?: React.ReactNode
  reverse?: boolean
}

interface ButtonProps {
  style?: React.CSSProperties

  // new props?
  onPress?: () => void
  onDoublePress?: () => void
  onPressIn?: () => void

  bg?: string
  ripple?: boolean

  icon?: IconProp
  text?: TextProps

  inverted?: InvertedProps
  image?: ImageProps // would replace text

  disabled?: boolean
  children?: React.ReactNode // using this would break inverted text
  
  // overrides
  borderRadius?: number
  paddingHorizontal?: number
  paddingVertical?: number
  iconSize?: number
}

const AnimatedIcon = animated(FontAwesomeIcon),
  AnimatedLabel = animated(Label)

const Button = (props: ButtonProps) => {
  const [styles, api] = useSpring(
    () => (
      {
        from: {
          transform: 'scale(100%)',
          border: `1px solid ${props.inverted?.color ?? Constants.Colors.All.main}`,
          backgroundColor: props.inverted?.secondaryColor ?? Constants.Colors.All.whiteSmoke,
          color: props.inverted?.color ?? Constants.Colors.All.main
        }
      }
    )
  )

  return (
    <animated.div
      onClick={props.onPress}
      onMouseEnter={
        () => {
          api.start(
            {
              from: {
                transform: 'scale(100%)',
                border: `1px solid ${props.inverted?.color ?? Constants.Colors.All.main}`,
                backgroundColor: props.inverted?.secondaryColor ?? Constants.Colors.All.whiteSmoke,
                color: props.inverted?.color ?? Constants.Colors.All.main
              },
              to: {
                transform: 'scale(110%)',
                border: `1px solid ${props.inverted?.secondaryColor ?? Constants.Colors.All.whiteSmoke}`,
                backgroundColor: props.inverted?.color ?? Constants.Colors.All.main,
                color: props.text?.color ?? Constants.Colors.Text.alt
              }
            }
          )
        }
      }
      onMouseLeave={
        () => {
          api.start(
            {
              to: {
                transform: 'scale(100%)',
                border: `1px solid ${props.inverted?.color ?? Constants.Colors.All.main}`,
                backgroundColor: props.inverted?.secondaryColor ?? Constants.Colors.All.whiteSmoke,
                color: props.inverted?.color ?? Constants.Colors.All.main
              },
              from: {
                transform: 'scale(110%)',
                border: `1px solid ${props.inverted?.secondaryColor ?? Constants.Colors.All.whiteSmoke}`,
                backgroundColor: props.inverted?.color ?? Constants.Colors.All.main,
                color: props.text?.color ?? Constants.Colors.Text.alt
              }
            }
          )
        }
      }
      style={
        {
          display: 'flex',
          flexDirection: props.text?.reverse ? 'row-reverse' : 'row',
          gap: 8,
          justifyContent: 'center',
          alignItems: 'center',
          paddingLeft: props.paddingHorizontal ?? 16,
          paddingRight: props.paddingHorizontal ?? 16,
          paddingTop: props.paddingVertical ?? 12,
          paddingBottom: props.paddingVertical ?? 12,
          borderRadius: props.borderRadius ?? 12,
          border: props.inverted ? styles.border : undefined,
          backgroundColor: props.inverted ? (
            props.inverted.forceFill ? (
              props.inverted.color ?? Constants.Colors.All.main
            ) : styles.backgroundColor
          ) : (
            props.bg ?? Constants.Colors.All.main
          ),
          cursor: 'pointer',
          userSelect: 'none',
          transform: props.inverted ? undefined: styles.transform,
          ...(props.style as any ?? {})
        }
      }
    >
      {
        props.children ? (
          props.children
        ) : (
          <>
            {
              props.icon ? (
                <AnimatedIcon
                  icon={props.icon}
                  fontSize={
                    props.iconSize ?? (props.text?.size ?? 16) + 2
                  }
                  color={
                    props.inverted ? (
                      props.inverted.forceFill ? (
                        props.text?.color ?? Constants.Colors.Text.alt
                      ) : styles.color
                    ) : (
                      props.text?.color ?? Constants.Colors.Text.alt
                    )
                  }
                />
              ) : null
            }

            {
              props.image ? (
                <img
                  src={props.image.source}
                  style={
                    {
                      width: props.image.width ?? 32,
                      height: props.image.height ?? 32
                    }
                  }
                />
              ) : (
                props.text ? (
                  typeof props.text.content === 'string' ? (
                    <AnimatedLabel
                      size={props.text.size}
                      color={
                        props.inverted ? (
                          props.inverted.forceFill ? (
                            props.text?.color ?? Constants.Colors.Text.alt
                          ) : styles.color
                        ) : (
                          props.text.color ?? Constants.Colors.Text.alt
                        )
                      }
                      text={props.text.content ?? ''}
                    />
                  ) : ( props.text.content ?? null )
                ) : null
              )
            }
          </>
        )
      }
    </animated.div>
  )
}

export default Button
