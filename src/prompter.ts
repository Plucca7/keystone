// The wizard talks to a Prompter, not to the terminal directly.
// Why: this keeps the question flow testable (a scripted prompter feeds answers
// in tests, with no flaky piping), and lets a richer UI — cards inside an AI
// assistant — plug in later without touching the wizard. See docs/setup-wizard.md.

import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

export interface Choice<T> {
  value: T
  label: string
}

export interface Prompter {
  text(question: string): Promise<string>
  choice<T>(question: string, choices: Choice<T>[]): Promise<T>
  close(): void
}

/** Real prompter: reads from the keyboard in plain text, zero AI cost. */
export class ReadlinePrompter implements Prompter {
  private rl = readline.createInterface({ input, output })

  async text(question: string): Promise<string> {
    let answer = ''
    while (answer.trim() === '') {
      answer = (await this.rl.question(`${question} `)).trim()
    }
    return answer
  }

  async choice<T>(question: string, choices: Choice<T>[]): Promise<T> {
    output.write(`${question}\n`)
    choices.forEach((c, i) => output.write(`  ${i + 1}) ${c.label}\n`))
    // Never trust raw input: loop until the typed number maps to a real option.
    // An out-of-range index yields undefined, which also covers the range check.
    while (true) {
      const picked = Number((await this.rl.question('> ')).trim())
      const chosen = Number.isInteger(picked) ? choices[picked - 1] : undefined
      if (chosen) {
        return chosen.value
      }
      output.write(`Please type a number between 1 and ${choices.length}.\n`)
    }
  }

  close(): void {
    this.rl.close()
  }
}

/** Scripted prompter for tests and automation: answers come from a list, in order. */
export class ScriptedPrompter implements Prompter {
  private index = 0
  private readonly answers: string[]

  constructor(answers: string[]) {
    this.answers = answers
  }

  async text(): Promise<string> {
    return this.next()
  }

  async choice<T>(_question: string, choices: Choice<T>[]): Promise<T> {
    const picked = Number(this.next())
    const chosen = Number.isInteger(picked) ? choices[picked - 1] : undefined
    if (!chosen) {
      throw new Error(`Scripted answer out of range: ${picked}`)
    }
    return chosen.value
  }

  private next(): string {
    const value = this.answers[this.index]
    if (value === undefined) {
      throw new Error('Scripted prompter ran out of answers')
    }
    this.index += 1
    return value
  }

  close(): void {}
}
