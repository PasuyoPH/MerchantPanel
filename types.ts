import { EventEmitter } from 'events'

interface PageProps {
  token?: string
  events: EventEmitter
  ws?: WebSocket
}

export type {
  PageProps
}