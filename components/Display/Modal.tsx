import { createPortal } from 'react-dom'
import { animated, useSpring, Spring } from '@react-spring/web'
import { Constants } from 'app-types'
import { useEffect, useRef } from 'react'

interface ModalContainerProps {
  paddingHorizontal?: number
  paddingVertical?: number
  borderRadius?: number
  style?: any
}

interface ModalProps {
  show?: boolean
  children?: React.ReactNode
  onDismiss?: () => void

  // overrides
  container?: ModalContainerProps
}

const Modal = (props: ModalProps) => {
    const [styles, api] = useSpring(
      () => (
        {
          from: {
            opacity: 0
          },
          to: {
            opacity: 1
          }
        }
      )
    ),
    portalRoot = useRef(document.getElementById('root')),
    portalContainer = useRef(document.createElement('div'))

  useEffect(
    () => {
      console.log('poggers')
      console.log(portalRoot.current)

      if (portalRoot.current)
        portalRoot.current.prepend(portalContainer.current)

      /*return () => {
        if (portalRoot.current)
          portalRoot.current.removeChild(portalContainer.current)
      }*/
    },
    []
  )
  
  return props.show ?
    createPortal(
      (
        <Spring
          from={{ opacity: 0 }}
          to={{ opacity: 1 }}
          config={{ duration: 200 }}
        >
          {
            (firstSpringProps) => (
              <animated.div
                style={
                  {
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgb(0, 0, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2,
                    overflow: 'hidden',
                    ...firstSpringProps
                  }
                }
                onClick={props.onDismiss}
              >
                <Spring
                  from={{ y: document.body.offsetHeight }}
                  to={{ y: 0 }}
                  config={{ duration: 200 }}
                >
                  {
                    (secondProps) => (
                      <animated.div
                        style={
                          {
                            backgroundColor: Constants.Colors.Layout.primary,
                            borderRadius: props.container?.borderRadius ?? 10,
                            display: 'flex',
                            flexDirection: 'row',
                            ...(props.container?.style ?? {}),
                            ...secondProps
                          }
                        }
                        onClick={
                          (event) => event.stopPropagation()
                        }
                      >
                        <div
                          style={
                            { padding: `${props.container?.paddingVertical ?? 16}px ${props.container?.paddingHorizontal ?? 32}px` }
                          }
                        >
                          {props.children}
                        </div>
                      </animated.div>
                    )
                  }
                </Spring>
              </animated.div>
            )
          }
        </Spring>
      ),
      portalContainer.current!
    ) : null
}

export default Modal