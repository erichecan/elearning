export type AppRole = 'child' | 'parent' | 'therapist' | 'admin'

const ROLE_CAPABILITIES: Record<AppRole, string[]> = {
  child: ['home.read', 'aac.use', 'focus.use', 'flashcards.learn', 'math.learn', 'storybook.read'],
  parent: [
    'home.read',
    'aac.use',
    'focus.use',
    'flashcards.manage',
    'math.manage',
    'storybook.manage',
    'vsd.manage',
    'rewards.manage',
    'analytics.read'
  ],
  therapist: ['home.read', 'aac.use', 'flashcards.manage', 'math.manage', 'analytics.read', 'abc.read'],
  admin: ['*']
}

export const roleService = {
  getCapabilities(role: AppRole) {
    return ROLE_CAPABILITIES[role] || []
  }
}

