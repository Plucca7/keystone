# Password reset via emailed link -- spec

> This is a worked example, not a template to fill by hand: an obviously generic
> feature (password reset) filled in exactly the way a real spec should be, so a new
> project has a concrete model to imitate rather than a blank form. The workflow: a
> feature opens with a spec like this and does not become code until the spec-reviewer
> approves it. When code and spec later diverge, the spec wins. Copy the shape of this
> file for the next real feature -- folder `NNN-your-feature`, same section headings --
> and delete the example content.

## The request, restated

A user who forgot their password has no way back into their account except contacting
support by hand, which does not scale past a handful of users and leaves the account
locked in the meantime. They need a self-service way to prove account ownership (via
their email address) and set a new password, without that path becoming a way for
anyone to take over an account they do not own.

## Done-target (verifiable)

From the login page, a user can click "Forgot password", submit their email, receive
an email containing a single-use reset link valid for 30 minutes, follow it to a form
that accepts a new password meeting the project's existing password policy, submit it,
and log in immediately afterward with the new password. The old password no longer
works. Submitting an email address that has no account returns the same on-screen
message as a valid one ("If an account exists for this address, a reset link was
sent") -- this is checked as a test, not left to inspection, because it is the one
line standing between this feature and an account-enumeration bug.

## Out of scope (now)

- Password strength meter or policy changes -- reuse whatever the project already
  enforces at signup.
- Reset via SMS or a security question -- email only, for this pass.
- Forcing sign-out of other active sessions when the password changes -- worth a
  follow-up issue, not blocking this one.

## Edge cases (each becomes a test)

- Email submitted for an address with no account -- same generic response as a valid
  address (see done-target); no email is actually sent, but nothing on-screen or
  timing-wise gives that away.
- The reset link is used twice -- the second use is rejected and tells the user to
  request a new link, it does not silently succeed or silently fail.
- The reset link is used after the 30-minute window -- rejected with a message that
  says it expired, not a generic error.
- Two reset requests for the same account before either is used -- only the newest
  link works; the older one is invalidated the moment the newer one is issued, so an
  attacker cannot race an intercepted older email against a legitimate newer one.
- New password submitted that fails the existing policy -- rejected inline with the
  same validation message signup already uses, not a new one invented for this form.

## Notes

Rate-limit the "forgot password" submission endpoint per email address and per IP --
this is a public, unauthenticated endpoint and an obvious target for both spam and
enumeration attempts; without a limit, the generic-response protection above can still
be worn down by brute force timing analysis at high volume. This belongs in the
security-auditor's review before merge, not only in code review.
