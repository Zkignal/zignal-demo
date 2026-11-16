"use strict";

const screens = document.querySelectorAll(".screen");
let profile = "main";
const profiles = {
  main: {
    balance: "0.01200000 DEMO",
    readiness: "prepare",
    sendState: 0,
    recording: false,
    screenshot: false,
    tor: false,
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
    tor: false,
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
    {match: /\b(panic|duress|decoy|pin|pins)\b/, reply: "The real app describes unlock, duress, and panic PINs. Here you can preview main and decoy profiles from the lock button, without entering a PIN or deleting anything."},
    {match: /\b(secure|security|safe|privacy|encrypt|encrypted|encryption|crypto|cryptography|anonymous)\b/, reply: "This page does not encrypt anything or provide security. It is a browser simulation. The real app's source describes its protections, but the project is experimental and unaudited."},
    {match: /\b(tor|vpn|network|server|servers|sync)\b/, reply: "The real app's Tor option covers sending and fetching transactions; syncing (block downloads, tree states and subtree roots) still connects directly. Open Network to try the illustrative switch; it changes no connections here."},
    {match: /\b(split|splits|splitting|notes)\b/, reply: "In the real wallet, a split divides a confirmed balance into smaller spendable notes, so several messages can go out without waiting for the previous message's change. Prepare does this only when helpful. Here it's just a simulated state."},
    {match: /\b(prepare|preparing|ready|confirm|confirming|confirmations)\b/, reply: "Prepare divides a confirmed balance into smaller notes so several messages can go out in a row. Try Prepare on Chats, then Simulate confirmations to reach Ready. No real balance or confirmations are involved here."},
    {match: /\b(qr|invite|invites|scan|scanning|connect|contact|contacts)\b/, reply: "Open New chat to view a non-scannable invite illustration or add a fictional sample contact. No camera, clipboard, real invite, or wallet address is used."},
    {match: /\b(wallet|fund|funds|funding|money|balance|zec|fee|fees|pay|payment)\b/, reply: "All balances here are fictional DEMO units. Never send funds to this preview. In the real app, a message uses a shielded Zcash transaction and costs a network fee."},
    {match: /\b(delivered|delivery|retry|resend|interrupted|transaction)\b/, reply: "The send-recovery walkthrough on Chats illustrates checking, retry, and delivery. In the real app, delivered means included in a block, not read. No transaction is created here."},
    {match: /\b(ai|bot|script|scripted|human|real|reply|replies|respond)\b/, reply: "I'm a local scripted demo contact, not a person or AI. I match a few topics in your message and show a prepared reply. Nothing is sent to an external service."},
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
  document.getElementById("profile-caption").textContent =
    profile === "decoy" ? "DECOY PROFILE · SIMULATED" : "MAIN PROFILE · SIMULATED";
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
  if (name === "conversation") {
    const messages = document.getElementById("messages");
    messages.scrollTop = messages.scrollHeight;
  }
}

document.querySelectorAll("[data-screen]").forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.screen));
});

document.querySelectorAll("[data-profile]").forEach(button => {
  button.addEventListener("click", () => {
    profile = button.dataset.profile;
    renderProfile();
    showScreen("chats");
  });
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
  {status: "Checking whether it went out… · simulated", detail: "Dev checks an interrupted send before showing a failure. Choose a scripted outcome below.", action: "Simulate transaction found", next: 3},
  {status: "Sent · simulated", detail: "The fictional transaction is waiting for a block, not a new send.", action: "Simulate inclusion in a block", next: 4},
  {status: "Delivered · simulated", detail: "Included in a fictional block. This does not mean read.", action: "Walkthrough complete"},
  {status: "Not sent · simulated", detail: "In this scenario broadcast failed, but the wallet still holds the transaction. Retry reuses it, instead of creating a second message.", action: "Tap to send again (simulation)", next: 3}
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
