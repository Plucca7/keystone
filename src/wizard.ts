// The wizard: it conducts the briefing, one question at a time, through a Prompter.
// Plain-text mode runs in any terminal with zero AI cost — faithful to the DNA.
// The content of the questions is the same whether asked as text or as cards.
// See docs/wizard-inicial.md.

import type { Prompter } from './prompter.ts'
import type {
  KeystoneAnswers,
  ProjectType,
  ScreenPriority,
  LookChoice,
  VersionTarget,
} from './types.ts'

/** Run the full briefing (round A + round B) and return the collected answers. */
export async function runWizard(prompter: Prompter, presetName?: string): Promise<KeystoneAnswers> {
  // Round A — product briefing
  const name = presetName ?? (await prompter.text('What is the project called?'))

  const type = await prompter.choice<ProjectType>('What kind of project is it?', [
    { value: 'site', label: 'Site / page (brochure, landing)' },
    { value: 'system', label: 'System with login and data (dashboard, app area)' },
    { value: 'service', label: 'Service that talks to other systems (an entry point)' },
    { value: 'mobile', label: 'Mobile app' },
  ])

  const language = await prompter.choice<string>('Starting language?', [
    { value: 'pt', label: 'Portuguese' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'other', label: 'Other' },
  ])

  const screen = await prompter.choice<ScreenPriority>('Screen priority?', [
    { value: 'mobile', label: 'Mobile first' },
    { value: 'desktop', label: 'Desktop first' },
    { value: 'both', label: 'Both equally' },
  ])

  const look = await prompter.choice<LookChoice>('The project’s look?', [
    { value: 'generate', label: 'Let the design step create it (from the product’s essence)' },
    { value: 'import', label: 'Import my own (existing brand / design)' },
    { value: 'later', label: 'Decide later (start with a neutral default)' },
  ])

  const sensitive = await prompter.choice<boolean>(
    'Does it handle sensitive data or money (personal data, payment, health, legal)?',
    [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ],
  )

  // Round B — technical setup
  const versionTarget = await prompter.choice<VersionTarget>('Where to version the code?', [
    { value: 'github', label: 'GitHub' },
    { value: 'gitlab', label: 'GitLab' },
    { value: 'local', label: 'Local only (no cloud)' },
  ])

  const isPrivate = await prompter.choice<boolean>('Visibility?', [
    { value: false, label: 'Public' },
    { value: true, label: 'Private' },
  ])

  const parentDir = await prompter.text(
    'Parent folder (Keystone creates the project folder inside it)?',
  )

  return {
    product: { name, type, language, screen, look, sensitive },
    setup: { versionTarget, isPrivate, parentDir },
  }
}
