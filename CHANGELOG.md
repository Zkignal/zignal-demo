# Changelog

Every change to this site, newest first. Each entry says what changed, why, and what it was
checked against. Earlier versions of changed files are kept in git history and, for local
reference, in the git-ignored `archive/` folder.

## 2026-11-28: the app's release private-testing-5, the height clock and the Tor message

Source checked: Zignal at `6853f15` (`main` and `dev`, tag `private-testing-5`): PRIVACY.md
and SECURITY.md (both unchanged since `72ba91f`), README and CHANGELOG; `WalletViews` (the
Network screen, unchanged) and `ChatViews`.

- **Demo page:** the "Latest" card names `private-testing-5`: the phone's date no longer
  decides anything, a light server's refusal is shown as one short quoted line, a contact's
  address is fully checked before every send, and a request that can't get through Tor says
  so. The intro and the source notes name the release. Under the card, a new link goes to
  the repository's notes for Zcash developers; it follows `main`, so it shows the newest
  version.
- **README:** the network point says the app no longer uses the phone's date, and what it
  does when a request can't get through Tor.
- **Privacy policy:** no change in wording. `PRIVACY.md` is unchanged, so the effective date
  stays November 25, 2026; only the page's link moves.
- **Links** to the app's README and changelog now point to `6853f15`. The chat list's note
  about block times and the Tor message aren't simulated. No CSS or JS change, so the cache
  tags stay `2026-11-22-private-testing`.

## 2026-11-25: the app's release private-testing-4, reminders and the live feed (`d1a1b1f`)

Source checked: Zignal at `72ba91f` (`main` and `dev`, tag `private-testing-4`): PRIVACY.md,
README, SECURITY.md and CHANGELOG; `WalletViews` (the Network screen's Tor note) and
`ChatViews`.

- **Privacy policy:** `privacy.html` now has, like `PRIVACY.md`, the notification permission
  (optional reminders the iPhone makes, never saying whether anything arrived) and the
  wallet's live feed of new transactions, which connects directly even with Tor on.
  Effective date November 25, 2026, the same as `PRIVACY.md`.
- **Demo page:** the "Latest" card names `private-testing-4` (new-message marks, reminders,
  block times checked against block height, the full invite address check); the simulated
  Network screen quotes the app's new Tor note; the limits card, the network card and its
  footnote name the live feed. The intro no longer says there is no public TestFlight link.
- **Links** now point to `72ba91f`. The reminders and new-message marks aren't simulated. No
  CSS or JS change, so the cache tags stay `2026-11-22-private-testing`.

## 2026-11-23: the app's release private-testing-3, what the light server learns (`ce8121a`)

Source checked: Zignal at `51c8a45` (`main` and `dev`, tag `private-testing-3`): PRIVACY.md,
README and CHANGELOG; `InviteViews` (no screen text changed since `e94d312`).

- **Privacy policy:** `privacy.html` now says, like `PRIVACY.md`, that the light server
  learns which transactions the app reads, because it fetches each one by its ID, with Tor
  on or off; what Tor off and Tor on add; and what helps today. A new line in "In short".
  Effective date November 23, 2026, the same as `PRIVACY.md`.
- **Demo page:** the "Latest" card names `private-testing-3` (the camera turns off as soon
  as an invite is read; the privacy policy's new text); the network card, the network
  footnote and the roadmap say the same. The privacy section refers to the current release.
- **Links** now point to `51c8a45`. The simulated screens are unchanged: the camera isn't
  simulated, and the app's screen text is the same as at `e94d312`.
- No CSS or JS change, so the cache tags stay `2026-11-22-private-testing`.

## 2026-11-22: the app's first release, private testing (`5c43039`)

Source checked: Zignal at `e94d312` (`main` and `dev`, tag `private-testing-1`): `SetupViews`,
`ChatViews`, `WalletViews`, `InviteViews`, `Components` (`PinStatus`), `AppModel`, `VaultOps`,
`WalletSupport`, `ProfileSession`, README and CHANGELOG.

- **Status:** Zignal is no longer part of the Zecathon and is in private testing on TestFlight,
  with invited testers; no public link yet. Every link now points to `e94d312`; the README
  anchor for the changes is `#since-the-zecathon-submission`.
- **Wrong PINs:** unlocking no longer gives tries back; only a quiet period with no wrong PIN
  starts the count over. The lock screen shows the app's "After 2 hours with no wrong PIN, the
  count starts over." under the countdown. Shortened for the demo to 2 minutes, and labelled.
- **Restore screen:** the app's red "Restoring isn't advised" warning, the choice of the PIN 1
  profile, the PIN 2 profile or both, and a block height or a date (October 1, 2026 with
  neither); a restored profile's notice that it came back without its chats.
- **Tor:** on for new profiles, as in the app; the Network footer is the app's new text, and
  the demo's switch starts on.
- **Sending:** a message in a block says "sent, waiting for a first reply" until the contact has
  answered once; the walkthrough gains that step and the app's slow-check text.
- **Copy and share:** Add funds and Your invite name the app's Copy and Share buttons; copies
  expire after 60 seconds and lock clears them. The first-message fee is about 0.00025 ZEC.
- **Screenshots 15 to 20** (the warning before a chat starts over, the restore screens, a
  restored profile's notice, the contact's side): the same files as `pics/` in the Zignal
  repository, byte for byte, holding only the PNG chunks IHDR, IDAT and IEND.
- "Latest" card, privacy and network cards, and roadmap brought up to the release.
- Cache tags on the CSS and JS moved to `2026-11-22-private-testing`.
- **Privacy policy:** new page `privacy.html`, linked from the footer and the privacy section:
  what the app, this site and TestFlight collect. Checked against the app's code at `e94d312`
  (`PrivacyInfo.xcprivacy`, the camera permission text, `WalletSupport`, `Keychain`,
  `ProfileStore`), Apple's "TestFlight & Privacy" page and GitHub's Pages documentation. Links
  inside the site are relative, so it can move to another domain unchanged. The same text is
  `PRIVACY.md` in the Zignal repository.

## 2026-11-16: which wallet is showing (`afaaeb1`)

- **Label above the phone**, on the frame and marked "Demo label · not in the app": "Showing:
  Wallet 1 · real profile" (blue), "Showing: Wallet 2 · decoy" (amber), "Locked", and
  "Wallet 1 erased" once the panic PIN has run. Without it, it was hard to tell which wallet
  was open, so the panic PIN's effect was easy to miss.
- **A line under the phone** explains what just happened, for example "Panic PIN 333333
  silently erased Wallet 1 and opened Wallet 2, the decoy. Nothing on the phone shows that
  anything happened."
- Kept off the phone's screen on purpose: the real app never shows which profile is open, so
  a forced unlock can't reveal the decoy. The panel uses the same names.
- Cache tags on the CSS and JS moved to `2026-11-16-wallets`.

## 2026-11-16: documentation (`6e9b7e8`)

- README: the screenshots' no-metadata check and how the files were made, the sources the PIN
  behaviour follows, how to try the panic PIN, the scope wording for the fictional profiles,
  and a new "Maintaining this site" section (no metadata, cache tags, changelog).
- This changelog: commit hashes on each entry.

## 2026-11-16: working PINs and a fresh-install reset (`5351de7`, `4680ddc`)

Source checked: Zignal `dev` at `e7bd418` (`UnlockView` in `SetupViews.swift`, `AppModel.unlock`,
the README's "Duress and panic" and wrong-PIN rules).

- **Enter PIN screen** in place of the old "Profile preview": the app's layout and words ("Enter
  PIN", Unlock, "Checking PIN…", "Wrong PIN.", "Too many wrong PINs. Try again in 0:05.").
- **The three PINs work, on fictional data in page memory:** `111111` opens the real profile,
  `222222` the decoy, `333333` erases the real profile and opens the decoy as if nothing
  happened. Afterwards the unlock PIN is wrong; duress and panic both open the decoy.
- **Wrong PINs:** 5 free, then a wait before each try, counted before the check and reset by a
  successful unlock, as at `e7bd418`. The wait is shortened for the demo and labelled (5 seconds
  doubling to 1 minute; the app uses 30 seconds doubling to 1 hour). Kit 37 will change this
  rule in the app; the demo follows when it ships.
- **Demo controls panel** beside the phone (below it on narrow screens): the demo PINs, a
  warning never to type a real PIN, the simulation state, and "Reset demo (fresh install)".
- **Removed** the "MAIN PROFILE / DECOY PROFILE" label inside the phone: the app never shows
  which profile is open. The panel shows it instead, outside the phone. Also removed the panic
  information screen; its content is now something you can do.
- Cache tags on the CSS and JS moved to `2026-11-16-pins` (`4680ddc`): the first push
  kept the earlier tag, so a browser that had visited before could keep the old script for up to
  10 minutes and the new buttons did nothing.
- "Create profiles" and "Skip to unlocked demo" act as a first install. The demo contact's
  reply about PINs explains how to try them.

## 2026-11-16: the real app, screen by screen (`6c326ce`)

Source checked: Zignal `dev` at `e7bd418` (SwiftUI screens, `WalletSupport.swift`, README).

**Real screenshots (new section, `img/`)**
- 14 screenshots of the real app, each captioned with its build: welcome, PINs, panic PIN,
  real and decoy profiles on mainnet, network settings, syncing, recovery words hidden during
  a recording, the screenshot warning, and the November 15 invite screens.
- Prepared for the web: 01 to 03 resized to 603 px wide; every file re-saved with no metadata
  (12 to 14 carried EXIF, 13 also XMP and a colour profile). No pixels edited.
- Checked before publishing: no QR codes, addresses, transaction IDs, recovery words or
  notifications in any image.
- Rule for this site, permanently: no metadata in any published file. Every image holds only
  the PNG chunks IHDR, IDAT and IEND (checked on all 14). The images were made on the Mac from
  the original screenshots, so no tool added anything on the way.
- Captions say where a screenshot is older than the app: the network settings (servers changed
  in `5e795ee`) and the "Prepare for chatting" button (now "Prepare").

**Phone simulation, now in the app's own words**
- Welcome: the four lines match the app exactly.
- Set PINs: the app's descriptions of the three PINs and the text under each PIN; the
  "I understand this can't be undone" switch; "Create profiles". The PIN fields are left out
  and the screen says so.
- Restore: the app's date question and what a restored phrase does (chats start empty, the
  decoy gets its own phrase).
- Chats: the recovery banner's subtitle and the wallet footer as the app shows them.
- Conversation: the "Message" field with the app's 4,000-byte counter.
- Add funds: the app's funding text (Orchard, 10 confirmations, about 0.03 ZEC for a few
  hundred messages).
- Network: the app's Tor footer, plus the six default servers on `dev` (zec.rocks, Stardust,
  Cake Wallet), with a note on what syncing still sends directly.
- Recovery: the four lines under the words and the app's screenshot warning.
- Invite and Add contact: "Only one of you scans", "Works once", and the refusal of a used
  invite (`e7bd418`).
- Contact: the app's name and safety-number text.

**Other**
- Header link to the new Screenshots section; cache tags on the CSS and JS set to `2026-11-16`.
- README: new "Screenshots" and "How the phone simulation follows the app" sections.

## 2026-11-16: first version on Zkignal (`b3a1890`)

- The demo moved to this repository from an earlier private copy, as one fresh commit.
- All links point to `Zkignal/zignal`, pinned to `e7bd418`.
- Tor wording: with Tor on, syncing (block downloads, tree states and subtree roots) still
  connects directly.
- The "Latest" card covers `e7bd418`, `5e795ee` and `f8b3881`; the roadmap card matches the
  repository's roadmap.
- `index.html` is a plain redirect to the experience.
