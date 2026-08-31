'use client'

import { useSyncExternalStore } from 'react'
import { demoAppStore } from '@/lib/demoApp/store'

export const useDemoSnapshot = () =>
  useSyncExternalStore(demoAppStore.subscribe, demoAppStore.getSnapshot, demoAppStore.getServerSnapshot)
