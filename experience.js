"use strict";

const screens = document.querySelectorAll(".screen");
let profile = "main";
let profiles = freshProfiles();

// What the simulated install knows. Kept in page memory only; a reload resets it.
const PINS = {unlock: "111111", duress: "222222", panic: "333333"};
const FREE_TRIES = 5;
const DEMO_WAIT_START = 5;   // seconds; the real app starts at 30
const DEMO_WAIT_MAX = 60;    // seconds; the real app stops at 1 hour
const DEMO_QUIET = 120;      // seconds with no wrong PIN before the count starts over; the real app: 2 hours
const device = {installed: false, realExists: false, open: null, tries: 0, waitUntil: 0, lastWrong: 0, checking: false};
let waitTimer = null;
let lastEvent = "fresh"; // what the explanation under the phone describes

function freshProfiles() {
  return {
    main: {
      balance: "0.01200000 DEMO",
      readiness: "prepare",
      sendState: 0,
      recording: false,
      screenshot: false,
      tor: true,
      selectedContact: "demo",
      contacts: {
        demo: {
          name: "Demo contact",
          verified: false,
          messages: [
            {side: "incoming", text: "Hi! This conversation is only a simulation."},
            {side: "outgoing", text: "I'm exploring Zignal's demo."},
            {side: "incoming", text: "Welcome! Say hello, or ask about invites, Tor, or Prepare."}
          ]
        }
      }
    },
    decoy: {
      balance: "0.00350000 DEMO",
      readiness: "prepare",
      sendState: 0,
      recording: false,
      screenshot: false,
      tor: true,
      selectedContact: "demo",
      contacts: {
        demo: {
          name: "Demo contact",
          verified: false,
          messages: [
            {side: "incoming", text: "Hello from the fictional decoy profile."},
            {side: "outgoing", text: "This is a separate sample conversation."}
          ]
        }
      }
    }
  };
}

function currentContact() {
  const current = profiles[profile];
  return current.contacts[current.selectedContact];
}

function renderContacts() {
  const list = document.getElementById("contact-list");
  list.replaceChildren();
  Object.entries(profiles[profile].contacts).forEach(([id, contact]) => {
    const button = document.createElement("button");
    button.className = "contact-row";
    button.dataset.contact = id;
    const content = document.createElement("span");
    const heading = document.createElement("strong");
    heading.textContent = contact.name;
    if (contact.verified) {
      const badge = document.createElement("span");
      badge.className = "demo-badge";
      badge.textContent = "Demo mark";
      heading.append(" ", badge);
    }
    const preview = document.createElement("small");
    if (id === "demo") preview.id = "last-message";
    preview.textContent = contact.messages[contact.messages.length - 1].text;
    const chevron = document.createElement("span");
    chevron.className = "chevron";
    chevron.textContent = "›";
    chevron.setAttribute("aria-hidden", "true");
    content.append(heading, preview);
    button.append(content, chevron);
    list.append(button);
  });
}

function createMessageEntry(item) {
  const entry = document.createElement("div");
  entry.className = `message-entry ${item.side}-entry`;
  const bubble = document.createElement("div");
  bubble.className = `bubble ${item.side}`;
  bubble.textContent = item.text;
  const caption = document.createElement("small");
  caption.className = "message-caption";
  caption.textContent = item.side === "incoming" ? "Scripted reply · simulated" : "Sample message · simulated";
  entry.append(bubble, caption);
  return entry;
}

function renderMessages() {
  const messages = document.getElementById("messages");
  const contact = currentContact();
  document.getElementById("conversation-title").textContent = contact.name;
  document.getElementById("contact-name").textContent = contact.name;
  document.getElementById("contact-verified").setAttribute("aria-checked", String(contact.verified));
  const date = document.createElement("div");
  date.className = "chat-date";
  date.textContent = "SCRIPTED CONVERSATION · LOCAL ONLY";
  messages.replaceChildren(date);
  messages.append(...contact.messages.map(createMessageEntry));
  renderContacts();
  messages.scrollTop = messages.scrollHeight;
}

function openConversation(id) {
  if (!Object.hasOwn(profiles[profile].contacts, id)) return;
  profiles[profile].selectedContact = id;
  document.getElementById("message").value = "";
  updateByteCount();
  renderMessages();
  showScreen("conversation");
}

function scriptedReply(text, contact) {
  const normalized = text.toLowerCase().replace(/[’']/g, "");
  const rules = [
    {match: /\b(recovery|phrase|seed|secret|password|credential)\b/, reply: "Please don't share real recovery words, passwords, or secrets. No recovery phrase exists here. The recovery screen uses placeholders only."},
    {match: /\b(panic|duress|decoy|pin|pins)\b/, reply: "Lock with the button at the top left, then use the demo PINs beside the phone: 111111 opens this profile, 222222 the decoy, and 333333 erases this profile (in page memory only) and opens the decoy. Reset demo starts over."},
    {match: /\b(secure|security|safe|privacy|encrypt|encrypted|encryption|crypto|cryptography|anonymous)\b/, reply: "This page does not encrypt anything or provide security. It is a browser simulation. The real app's source describes its protections, but the project is experimental and unaudited."},
    {match: /\b(tor|vpn|network|server|servers|sync)\b/, reply: "In the real app, Tor is on for new profiles and covers sending and fetching transactions; syncing (block downloads, tree states and subtree roots) still connects directly. Open Network to try the illustrative switch; it changes no connections here."},
    {match: /\b(split|splits|splitting|notes)\b/, reply: "In the real wallet, a split divides a confirmed balance into smaller spendable notes, so several messages can go out without waiting for the previous message's change. Prepare does this only when helpful. Here it's just a simulated state."},
    {match: /\b(prepare|preparing|ready|confirm|confirming|confirmations)\b/, reply: "Prepare divides a confirmed balance into smaller notes so several messages can go out in a row. Try Prepare on Chats, then Simulate confirmations to reach Ready. No real balance or confirmations are involved here."},
    {match: /\b(restore|restoring|backup|restored)\b/, reply: "The real app advises against restoring: it brings back a wallet and identity, never chats. If you do, it asks which profile (PIN 1, PIN 2 or both) and a block height or date to scan from. This preview restores nothing."},
    {match: /\b(qr|invite|invites|scan|scanning|connect|contact|contacts)\b/, reply: "Open New chat to view a non-scannable invite illustration or add a fictional sample contact. No camera, clipboard, real invite, or wallet address is used."},
    {match: /\b(wallet|fund|funds|funding|money|balance|zec|fee|fees|pay|payment)\b/, reply: "All balances here are fictional DEMO units. Never send funds to this preview. In the real app, a message uses a shielded Zcash transaction and costs a network fee."},
    {match: /\b(delivered|delivery|retry|resend|interrupted|transaction|reply|waiting)\b/, reply: "The send-recovery walkthrough on Chats illustrates checking, retry, and delivery. In the real app, a message in a block shows \u201csent, waiting for a first reply\u201d until the contact has answered once, then \u201cdelivered\u201d. Neither means read. No transaction is created here."},
    {match: /\b(ai|bot|script|scripted|human|real|replies|respond)\b/, reply: "I'm a local scripted demo contact, not a person or AI. I match a few topics in your message and show a prepared reply. Nothing is sent to an external service."},
    {match: /\b(help|what can|how does|how do|zignal|demo|testing|test)\b/, reply: "You can ask me about invites, Tor, Prepare, wallet fees, or the simulation's limits. You can also explore the recovery and profile screens. All of it stays fictional."},
    {match: /\b(how are you|hows it going|whats up)\b/, reply: "Ready to chat! I'm a scripted contact in a fictional conversation. How are you finding the demo?"},
    {match: /\b(thanks|thank you|thx)\b/, reply: "You're welcome! Try another message, or explore the other screens. I'm here with local, scripted replies."},
    {match: /\b(hello|hi|hey|greetings)\b/, reply: `Hi! You're chatting with ${contact.name} in a simulation. What would you like to explore?`},
    {match: /\b(bye|goodbye|see you)\b/, reply: "See you! This conversation is temporary and resets when you reload the page."},
    {match: /\b(great|nice|cool|awesome|good|love)\b/, reply: "Glad you're trying it out! You can keep chatting, preview another profile, or use a sample invite to add a fictional contact."}
  ];
  const rule = rules.find(item => item.match.test(normalized));
  if (rule) return rule.reply;
  return `You said: “${text}”\nI can echo your message, but I don't understand arbitrary conversation. Try asking about invites, Tor, Prepare, or wallet fees.`;
}

function renderProfile() {
  const current = profiles[profile];
  document.getElementById("wallet-balance").textContent = current.balance;
  renderReadiness();
  renderSendRecovery();
  renderCapture();
  document.getElementById("message").value = "";
  updateByteCount();
  document.getElementById("tor-toggle").setAttribute("aria-checked", String(current.tor));
  renderMessages();
}

function showScreen(name) {
  const target = document.getElementById(name);
  if (!target || !target.classList.contains("screen")) return;
  screens.forEach(screen => screen.classList.toggle("active", screen === target));
  const scroll = target.querySelector(".scroll");
  if (scroll) scroll.scrollTop = 0;
  renderPanel();
  if (name === "conversation") {
    const messages = document.getElementById("messages");
    messages.scrollTop = messages.scrollHeight;
  }
}

document.querySelectorAll("[data-screen]").forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.screen));
});

// --- Install, lock and the three PINs (as in AppModel.unlock and VaultOps at e94d312) ---

function renderPanel() {
  document.getElementById("state-install").textContent = device.installed ? "Set up, demo PINs active" : "Fresh, not set up";
  const active = document.querySelector(".screen.active");
  let open = "Setup";
  if (device.installed) open = device.open === "main" ? "Wallet 1 · real profile" : device.open === "decoy" ? "Wallet 2 · decoy" : "Locked: Enter PIN";
  else if (active && active.id === "welcome") open = "Welcome";
  document.getElementById("state-open").textContent = open;
  document.getElementById("state-real").textContent = !device.installed ? "Not created yet"
    : device.realExists ? "Wallet 1 on this phone" : "Wallet 1 erased by the panic PIN";
  applyQuietPeriod();
  document.getElementById("state-tries").textContent = device.tries <= FREE_TRIES
    ? `${device.tries} (${FREE_TRIES} are free)` : `${device.tries} (waiting after each)`;
  renderWalletTag();
}

// The label above the phone and the line under it. Demo only: the real app shows neither.
function renderWalletTag() {
  const tag = document.getElementById("wallet-tag");
  const text = document.getElementById("wallet-tag-text");
  const erased = device.installed && !device.realExists ? " · Wallet 1 erased" : "";
  let state = "none";
  if (!device.installed) text.textContent = "Fresh install · no wallets yet";
  else if (device.open === "main") { state = "real"; text.textContent = "Showing: Wallet 1 · real profile"; }
  else if (device.open === "decoy") { state = "decoy"; text.textContent = "Showing: Wallet 2 · decoy" + erased; }
  else { state = "locked"; text.textContent = "Locked" + (erased || " · both wallets on this phone"); }
  tag.dataset.state = state;
  const explain = {
    fresh: "Tap Get started, then Create profiles. That makes Wallet 1 (your real profile) and Wallet 2 (the decoy).",
    reset: "Reset: a fresh install with no wallets. Tap Get started, then Create profiles.",
    install: "Wallet 1 is your real profile. Lock (top left), then enter a PIN from the panel to see what each one opens.",
    lock: device.realExists
      ? "Locked. 111111 opens Wallet 1, 222222 opens Wallet 2 (the decoy), 333333 erases Wallet 1 and opens Wallet 2."
      : "Locked. Wallet 1 is gone: 111111 is now a wrong PIN. 222222 and 333333 both open Wallet 2.",
    unlock: "Unlock PIN 111111 opened Wallet 1, your real profile.",
    duress: "Duress PIN 222222 opened Wallet 2, the decoy. Wallet 1 is untouched. The phone looks the same either way: the real app never says which wallet is open.",
    panic: "Panic PIN 333333 silently erased Wallet 1 and opened Wallet 2, the decoy. Nothing on the phone shows that anything happened. Lock and try 111111: it's now a wrong PIN.",
    panicAgain: "Panic PIN 333333 opened Wallet 2, the decoy. Wallet 1 was already erased.",
    wrongAfterPanic: "111111 opens nothing now: the panic PIN erased Wallet 1, so its PIN is gone with it. Reset demo to start over.",
    wrong: "Wrong PIN: it opens nothing. After 5 wrong PINs, each try waits (shortened here). Unlocking doesn't give tries back; only a quiet period with no wrong PIN does."
  };
  document.getElementById("wallet-explain").textContent = explain[lastEvent] || "";
}

function install() {
  lastEvent = "install";
  profiles = freshProfiles();
  Object.assign(device, {installed: true, realExists: true, tries: 0, waitUntil: 0, lastWrong: 0});
  openProfile("main");
}

function openProfile(name) {
  profile = name;
  device.open = name;
  renderProfile();
  showScreen("chats");
}

function lock() {
  device.open = null;
  lastEvent = "lock";
  document.getElementById("pin").value = "";
  document.getElementById("pin-status").textContent = "";
  updateUnlockButton();
  showScreen("lock");
}

// The wrong-PIN count starts over only after a quiet period with no wrong PIN (shortened here).
function applyQuietPeriod() {
  if (device.tries > 0 && device.lastWrong && Date.now() - device.lastWrong >= DEMO_QUIET * 1000) {
    device.tries = 0;
    device.waitUntil = 0;
  }
}

function remainingWait() {
  return Math.max(0, Math.ceil((device.waitUntil - Date.now()) / 1000));
}

function updateUnlockButton() {
  const pin = document.getElementById("pin").value;
  document.getElementById("unlock-button").disabled = pin.length < 6 || device.checking || remainingWait() > 0;
}

function showWait() {
  clearInterval(waitTimer);
  const tick = () => {
    const s = remainingWait();
    if (s > 0) {
      document.getElementById("pin-status").textContent =
        `Too many wrong PINs. Try again in ${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}.`;
      document.getElementById("pin-rest").hidden = false;
    } else {
      clearInterval(waitTimer);
      document.getElementById("pin-status").textContent = "";
      document.getElementById("pin-rest").hidden = true;
    }
    updateUnlockButton();
  };
  tick();
  waitTimer = setInterval(tick, 1000);
}

function checkPin(pin) {
  // Counted before the check. A PIN that opens a profile takes back only its own count:
  // unlocking never earns tries back (e94d312). The count starts over after a quiet period.
  applyQuietPeriod();
  const before = device.tries;
  device.tries += 1;
  let opened = null;
  if (pin === PINS.unlock && device.realExists) { opened = "main"; lastEvent = "unlock"; }
  else if (pin === PINS.duress) { opened = "decoy"; lastEvent = "duress"; }
  else if (pin === PINS.panic) {
    lastEvent = device.realExists ? "panic" : "panicAgain";
    if (device.realExists) {
      // Silent wipe: the real profile's slot, chats, contacts and wallet are gone.
      profiles.main = null;
      device.realExists = false;
    }
    opened = "decoy";
  }
  if (opened) {
    device.tries = before;
    openProfile(opened);
    return;
  }
  device.lastWrong = Date.now();
  lastEvent = pin === PINS.unlock ? "wrongAfterPanic" : "wrong";
  document.getElementById("pin-status").textContent = "Wrong PIN.";
  if (device.tries >= FREE_TRIES) {
    const wait = Math.min(DEMO_WAIT_MAX, DEMO_WAIT_START * 2 ** (device.tries - FREE_TRIES));
    device.waitUntil = Date.now() + wait * 1000;
    showWait();
  }
  renderPanel();
}

document.getElementById("unlock-form").addEventListener("submit", event => {
  event.preventDefault();
  const input = document.getElementById("pin");
  const pin = input.value;
  if (pin.length < 6 || device.checking || remainingWait() > 0) return;
  device.checking = true;
  document.getElementById("pin-status").textContent = "Checking PIN…";
  updateUnlockButton();
  // The real check takes about a second, the same for all three PINs.
  setTimeout(() => {
    device.checking = false;
    input.value = "";
    checkPin(pin);
    updateUnlockButton();
  }, 900);
});

document.getElementById("pin").addEventListener("input", event => {
  event.target.value = event.target.value.replace(/\D/g, "");
  updateUnlockButton();
});

document.getElementById("create-profiles").addEventListener("click", install);
document.getElementById("skip-setup").addEventListener("click", install);
document.getElementById("lock-button").addEventListener("click", lock);

document.getElementById("reset-demo").addEventListener("click", () => {
  clearInterval(waitTimer);
  profiles = freshProfiles();
  profile = "main";
  Object.assign(device, {installed: false, realExists: false, open: null, tries: 0, waitUntil: 0, lastWrong: 0, checking: false});
  lastEvent = "reset";
  document.getElementById("pin").value = "";
  document.getElementById("pin-status").textContent = "";
  document.getElementById("pin-rest").hidden = true;
  renderProfile();
  showScreen("welcome");
});

document.getElementById("contact-list").addEventListener("click", event => {
  const button = event.target.closest("[data-contact]");
  if (button) openConversation(button.dataset.contact);
});

document.getElementById("start-demo-chat").addEventListener("click", () => openConversation("demo"));

document.getElementById("add-sample-contact").addEventListener("click", () => {
  const contacts = profiles[profile].contacts;
  if (!Object.hasOwn(contacts, "sample")) {
    contacts.sample = {
      name: "New contact",
      verified: false,
      messages: [
        {side: "incoming", text: "Hi from your fictional new contact! This sample invite connects only a local scripted conversation."}
      ]
    };
  }
  openConversation("sample");
});

document.getElementById("contact-verified").addEventListener("click", () => {
  const contact = currentContact();
  contact.verified = !contact.verified;
  renderMessages();
});

function renderReadiness() {
  const readiness = profiles[profile].readiness;
  const button = document.getElementById("prepare-button");
  button.querySelector("span").textContent =
    {prepare: "Prepare", confirming: "Confirming…", ready: "Ready"}[readiness];
  button.disabled = readiness !== "prepare";
  document.getElementById("wallet-ready").textContent = {
    prepare: "Simulation: Prepare splits only when helpful.",
    confirming: "Simulation: waiting for confirmations, not splitting again.",
    ready: "Simulation: ready for several messages in a row."
  }[readiness];
  document.getElementById("confirm-prepare").hidden = readiness !== "confirming";
}

document.getElementById("prepare-button").addEventListener("click", () => {
  if (profiles[profile].readiness !== "prepare") return;
  profiles[profile].readiness = "confirming";
  renderReadiness();
});

document.getElementById("confirm-prepare").addEventListener("click", () => {
  if (profiles[profile].readiness !== "confirming") return;
  profiles[profile].readiness = "ready";
  renderReadiness();
});

const sendSteps = [
  {status: "Ready to explore", detail: "One fictional message. No funds or network.", action: "Simulate sending", next: 1},
  {status: "Sending · simulated", detail: "The fictional transaction has been created.", action: "Simulate lock and unlock", next: 2},
  {status: "Checking whether it went out… · simulated", detail: "The app checks an interrupted send before showing a failure. After a minute it says: \u201cStill checking whether it went out: the wallet hasn't caught up with the network yet. Zignal keeps trying.\u201d Choose a scripted outcome below.", action: "Simulate transaction found", next: 3},
  {status: "Sent · simulated", detail: "The fictional transaction is waiting for a block, not a new send.", action: "Simulate inclusion in a block", next: 4},
  {status: "Sent, waiting for a first reply · simulated", detail: "Included in a fictional block. Until the contact has answered once in this chat, the app says this instead of \u201cdelivered\u201d: a block doesn't show that their phone could read it.", action: "Simulate the contact's first reply", next: 6},
  {status: "Not sent · simulated", detail: "In this scenario broadcast failed, but the wallet still holds the transaction. Retry reuses it, instead of creating a second message.", action: "Tap to send again (simulation)", next: 3},
  {status: "Delivered · simulated", detail: "Included in a fictional block, and the contact has replied before. Delivered still doesn't mean read.", action: "Walkthrough complete"}
];

function renderSendRecovery() {
  const state = profiles[profile].sendState;
  const step = sendSteps[state];
  document.getElementById("send-status").textContent = step.status;
  document.getElementById("send-detail").textContent = step.detail;
  const button = document.getElementById("send-step");
  button.textContent = step.action;
  button.disabled = step.next === undefined;
  document.getElementById("send-missing").hidden = state !== 2;
}

document.getElementById("send-step").addEventListener("click", () => {
  const current = profiles[profile];
  const next = sendSteps[current.sendState].next;
  if (next === undefined) return;
  current.sendState = next;
  renderSendRecovery();
});

document.getElementById("send-missing").addEventListener("click", () => {
  if (profiles[profile].sendState !== 2) return;
  profiles[profile].sendState = 5;
  renderSendRecovery();
});

document.getElementById("send-restart").addEventListener("click", () => {
  profiles[profile].sendState = 0;
  renderSendRecovery();
});

function renderCapture() {
  const current = profiles[profile];
  document.getElementById("capture-status").textContent = current.recording
    ? "Simulated recording: the real app would hide the recovery words here."
    : "Placeholder only. No recovery words are generated.";
  const toggle = document.getElementById("capture-toggle");
  toggle.setAttribute("aria-pressed", String(current.recording));
  toggle.textContent = current.recording ? "End simulated recording" : "Simulate screen recording";
  document.getElementById("capture-screenshot").disabled = current.recording;
  document.getElementById("capture-warning").hidden = !current.screenshot;
}

document.getElementById("capture-toggle").addEventListener("click", () => {
  profiles[profile].recording = !profiles[profile].recording;
  renderCapture();
});

document.getElementById("capture-screenshot").addEventListener("click", () => {
  if (profiles[profile].recording) return;
  profiles[profile].screenshot = true;
  renderCapture();
});

document.getElementById("tor-toggle").addEventListener("click", event => {
  const button = event.currentTarget;
  profiles[profile].tor = !profiles[profile].tor;
  button.setAttribute("aria-checked", String(profiles[profile].tor));
});

document.getElementById("message-form").addEventListener("submit", event => {
  event.preventDefault();
  const input = document.getElementById("message");
  const text = input.value.trim();
  if (!text) return;
  const contact = currentContact();
  const exchange = [
    {side: "outgoing", text},
    {side: "incoming", text: scriptedReply(text, contact)}
  ];
  contact.messages.push(...exchange);
  input.value = "";
  updateByteCount();
  const messages = document.getElementById("messages");
  messages.append(...exchange.map(createMessageEntry));
  messages.scrollTop = messages.scrollHeight;
  renderContacts();
});

function updateByteCount() {
  const bytes = new TextEncoder().encode(document.getElementById("message").value).length;
  document.getElementById("byte-count").textContent = `${bytes} / 4000`;
}

document.getElementById("message").addEventListener("input", updateByteCount);

renderProfile();
updateByteCount();
renderPanel();
