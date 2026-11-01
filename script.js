'use strict';
const CHAT_RESPONSES = [
  {
    keywords: ['first day', 'day one', 'tomorrow', 'start'],
    reply: `Great question! Here's a quick checklist for your first day:\n• Arrive 10–15 minutes early and bring your ID documents.\n• Your main goal is to listen and observe — don't pressure yourself to know everything.\n• Introduce yourself warmly to your team and manager.\n• Get your laptop set up and your email configured.\n• Write down names, processes, and tools you hear about — you'll thank yourself later! 📝`
  },
  {
    keywords: ['tool', 'setup', 'software', 'laptop', 'computer', 'install', 'slack', 'jira', 'email'],
    reply: `Setting up your tools early sets you up for success! A few tips:\n• Ask your IT contact or manager for the official tool list.\n• Common tools include Slack (chat), Jira/Trello (tasks), Confluence/Notion (docs), and your company email.\n• Set up 2FA (two-factor authentication) on all accounts right away.\n• Don't hesitate to ask your onboarding buddy if you're stuck — that's what they're there for! 🛠️`
  },
  {
    keywords: ['culture', 'values', 'environment', 'vibe', 'team', 'company'],
    reply: `Company culture is one of the most important things to understand early on! A few pointers:\n• Observe how people communicate — formally or informally, Slack or email, async or meetings.\n• Ask your buddy about "unwritten rules" that aren't in the handbook.\n• Take part in team rituals (standups, team lunches, all-hands) to get a feel for the rhythm.\n• Most teams appreciate a new hire who asks thoughtful questions and shows genuine curiosity. 🌱`
  },
  {
    keywords: ['who', 'meet', 'introduce', 'people', 'manager', 'hr', 'buddy', 'colleague'],
    reply: `Knowing who to meet first can make a huge difference! Here's a suggested order:\n1. **Your direct manager** — understand their expectations and communication style.\n2. **Your immediate team** — learn everyone's roles and current projects.\n3. **Your HR contact** — for payroll, benefits, and policy questions.\n4. **Your onboarding buddy** — your informal guide to getting things done.\n5. **Key cross-functional partners** — whoever your team works with most. 🤝`
  },
  {
    keywords: ['help', 'ask', 'bother', 'question', 'stuck', 'don\'t know'],
    reply: `Asking for help is a superpower, not a weakness! A few strategies:\n• Ask your buddy first for day-to-day questions — that's their role.\n• Use Slack/Teams to search if a question has been asked before.\n• When asking, show you've done some research first: "I tried X and Y, but I'm stuck on Z."\n• Most experienced colleagues actually enjoy helping — it's how they pay it forward. 💡`
  },
  {
    keywords: ['benefit', 'pay', 'salary', 'leave', 'holiday', 'vacation', 'time off', 'sick'],
    reply: `Benefits and leave policies are important to understand early! My advice:\n• Review the employee handbook for leave entitlements, sick days, and public holidays.\n• Ask your HR contact about when benefits (health insurance, etc.) kick in — some have a waiting period.\n• Note the process for requesting time off (approval workflow, notice period, systems used).\n• Don't be shy about asking HR — it's literally their job to explain this to you. 📋`
  },
  {
    keywords: ['goal', '30', '60', '90', 'expectation', 'performance', 'review', 'success'],
    reply: `Setting clear goals early is one of the best things you can do! Recommendations:\n• Ask your manager to define success for your first 30, 60, and 90 days.\n• Write down what's expected and share a summary with your manager to confirm alignment.\n• Focus on learning and contributing small wins in the first month — don't try to change the world yet.\n• Schedule a 1-month check-in with your manager to review how things are going. 🎯`
  },
  {
    keywords: ['nervous', 'anxious', 'scared', 'overwhelm', 'stress', 'worry'],
    reply: `Feeling nervous is completely normal — even very experienced professionals feel this way starting a new role! Remember:\n• Nobody expects you to know everything on day one. Learning takes time.\n• Your colleagues went through exactly the same thing.\n• Being curious and kind will take you further than trying to seem impressive.\n• Take things one task at a time. You've got this! 💪`
  },
  {
    keywords: ['intern', 'internship', 'student', 'university', 'college'],
    reply: `Welcome, intern! Internships are incredible learning opportunities. A few tips specifically for you:\n• Be proactive — ask to join meetings, shadow people, and take on small projects.\n• Keep a daily log of what you learn. It'll be gold for your resume later.\n• Ask your supervisor what a "successful internship" looks like from their perspective.\n• Network! The relationships you build here can shape your career for years. 🎓`
  },
  {
    keywords: ['graduate', 'grad', 'fresh', 'new grad', 'degree', 'campus'],
    reply: `Transitioning from campus to corporate is a big shift — you're not alone in finding it different!\n• The pace and structure will feel different from university — embrace the change.\n• Proactively seek feedback; in school you got grades, at work you need to ask.\n• "I don't know, but I'll find out" is a perfectly valid professional answer.\n• Find a mentor early — someone a few years ahead of you can offer invaluable perspective. 🌟`
  },
  {
    keywords: ['hi', 'hello', 'hey', 'howdy', 'greet'],
    reply: `Hello! 👋 I'm your Onboarding Buddy — here to help you settle in.\nYou can ask me things like:\n• "What should I do on my first day?"\n• "How do I ask for help without bothering people?"\n• "What should I know about company culture?"\nWhat's on your mind?`
  },
  {
    keywords: ['thank', 'thanks', 'appreciate', 'helpful', 'great answer'],
    reply: `You're very welcome! 😊 That's what I'm here for. Is there anything else you'd like to know about getting started? Don't hesitate to ask!`
  }
];

const FALLBACK_RESPONSES = [
  `That's a great question! I'd recommend bringing it up with your manager or HR contact — they'll have the most accurate answer for your specific company context. In the meantime, check your employee handbook or intranet if you have one. 📚`,
  `I don't have a specific answer for that right now, but your onboarding buddy or HR team would be the best people to ask. They've helped dozens of new starters — you're in good hands! 🙌`,
  `Hmm, I'm not sure about that one specifically! It might be covered in your company's orientation materials. Your manager or a senior colleague would also be a great resource. Don't be shy about asking! 💬`,
  `Good question! While I don't have the exact answer, this is a perfect one for your first 1-on-1 with your manager. Jot it down in your notes so you don't forget to ask. ✏️`
];

const ROLE_CONFIG = {
  new:    { label: 'New Employee',   badgeClass: 'role-badge--new' },
  intern: { label: 'Intern',         badgeClass: 'role-badge--intern' },
  grad:   { label: 'Fresh Graduate', badgeClass: 'role-badge--grad' }
};

function sanitize(str) {
  return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}


function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function findResponse(text) {
  const lower = text.toLowerCase();
  for (const item of CHAT_RESPONSES) {
    if (item.keywords.some(kw => lower.includes(kw))) {
      return item.reply;
    }
  }
  return randomFrom(FALLBACK_RESPONSES);
}

function formatReply(text) {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

const roleSelect       = document.getElementById('role-select');
const nameInput        = document.getElementById('name-input');
const displayName      = document.getElementById('display-name');
const displayRoleBadge = document.getElementById('display-role-badge');

const completedCount   = document.getElementById('completed-count');
const totalCount       = document.getElementById('total-count');
const percentDisplay   = document.getElementById('percent-display');
const progressBar      = document.getElementById('progress-bar');
const progressBarTrack = progressBar.closest('[role="progressbar"]');
const progressMessage  = document.getElementById('progress-message');

const dayBadge         = document.getElementById('day-badge');
const weekBadge        = document.getElementById('week-badge');

const chatMessages     = document.getElementById('chat-messages');
const chatInput        = document.getElementById('chat-input');
const chatSend         = document.getElementById('chat-send');
const quickReplies     = document.getElementById('quick-replies');

const footerYear       = document.getElementById('footer-year');

function init() {
  // Footer year
  footerYear.textContent = new Date().getFullYear();

  // Count tasks and set initial badges
  updateProgress();

  // Role selector
  roleSelect.addEventListener('change', handleRoleChange);

  // Name input
  nameInput.addEventListener('input', handleNameInput);

  // Checkboxes
  document.querySelectorAll('.check-input').forEach(cb => {
    cb.addEventListener('change', handleCheckboxChange);
  });

  // Chat send button
  chatSend.addEventListener('click', handleChatSend);

  // Chat input — send on Enter
  chatInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  });

  // Quick reply buttons
  quickReplies.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const question = this.getAttribute('data-q');
      if (question) {
        chatInput.value = question;
        handleChatSend();
      }
    });
  });

  // Nav active state on scroll
  setupNavHighlight();
}

function handleRoleChange() {
  const role = roleSelect.value;
  const config = ROLE_CONFIG[role] || ROLE_CONFIG['new'];

  // Update badge text
  displayRoleBadge.textContent = config.label;

  // Swap badge class
  displayRoleBadge.className = 'role-badge ' + config.badgeClass;
}

function handleNameInput() {
  const val = nameInput.value.trim();
  displayName.textContent = val || 'New Employee';
}


function handleCheckboxChange(e) {
  const item = e.target.closest('.checklist-item');
  if (item) {
    if (e.target.checked) {
      item.classList.add('is-done');
    } else {
      item.classList.remove('is-done');
    }
  }
  updateProgress();
}

function updateProgress() {
  const allCheckboxes  = document.querySelectorAll('.check-input');
  const dayCheckboxes  = document.querySelectorAll('.check-input[data-group="day"]');
  const weekCheckboxes = document.querySelectorAll('.check-input[data-group="week"]');

  const total     = allCheckboxes.length;
  const completed = document.querySelectorAll('.check-input:checked').length;

  const dayTotal     = dayCheckboxes.length;
  const dayCompleted = document.querySelectorAll('.check-input[data-group="day"]:checked').length;

  const weekTotal     = weekCheckboxes.length;
  const weekCompleted = document.querySelectorAll('.check-input[data-group="week"]:checked').length;

  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Update stats
  completedCount.textContent  = completed;
  totalCount.textContent      = total;
  percentDisplay.textContent  = percent + '%';

  // Update progress bar
  progressBar.style.width = percent + '%';
  progressBarTrack.setAttribute('aria-valuenow', percent);

  // Group badges
  dayBadge.textContent  = dayCompleted + ' / ' + dayTotal;
  weekBadge.textContent = weekCompleted + ' / ' + weekTotal;

  // Progress message
  progressMessage.textContent = getProgressMessage(percent, completed, total);
}

function getProgressMessage(percent, completed, total) {
  if (percent === 0)   return 'Start checking off tasks to track your progress.';
  if (percent < 25)    return `Great start! You've completed ${completed} of ${total} tasks. Keep going!`;
  if (percent < 50)    return `You're making solid progress — ${completed}/${total} tasks done. Keep it up!`;
  if (percent < 75)    return `Over halfway there! ${completed}/${total} tasks complete. You're doing great!`;
  if (percent < 100)   return `Almost there! Just ${total - completed} task${total - completed !== 1 ? 's' : ''} left. Finish strong!`;
  return `🎉 Congratulations! You've completed all ${total} onboarding tasks. Welcome to the team!`;
}

/* ============================================================
   CHAT
   ============================================================ */
let typingTimeout = null;

function handleChatSend() {
  const text = chatInput.value.trim();
  if (!text) {
    chatInput.focus();
    return;
  }

  // Append user message
  appendMessage('user', text);
  chatInput.value = '';
  chatInput.focus();

  // Disable input while "typing"
  setInputDisabled(true);

  // Show typing indicator
  const typingId = appendTypingIndicator();

  // Simulate a realistic response delay (800–1600ms)
  const delay = 800 + Math.random() * 800;
  typingTimeout = setTimeout(function () {
    removeTypingIndicator(typingId);
    const response = findResponse(text);
    appendMessage('buddy', response, true);
    setInputDisabled(false);
    chatInput.focus();
  }, delay);
}

function appendMessage(role, text, isHTML) {
  const msg = document.createElement('div');
  msg.className = 'msg msg--' + role;
  msg.setAttribute('aria-label', role === 'buddy' ? 'Buddy says' : 'You said');

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = role === 'buddy' ? '🤖' : '🧑';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';

  if (isHTML) {
    bubble.innerHTML = formatReply(text);
  } else {
    // User messages: safe text only
    const p = document.createElement('p');
    p.textContent = text;
    bubble.appendChild(p);
  }

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  chatMessages.appendChild(msg);
  scrollChatToBottom();
  return msg;
}

function appendTypingIndicator() {
  const id = 'typing-' + Date.now();
  const msg = document.createElement('div');
  msg.className = 'msg msg--buddy msg-typing';
  msg.id = id;
  msg.setAttribute('aria-live', 'off');

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = '🤖';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.setAttribute('aria-label', 'Buddy is typing');

  // Three bouncing dots via CSS
  const dots = document.createElement('div');
  dots.className = 'typing-dots';
  dots.innerHTML = '<span></span><span></span><span></span>';
  bubble.appendChild(dots);

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  chatMessages.appendChild(msg);
  scrollChatToBottom();
  return id;
}

function removeTypingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function scrollChatToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setInputDisabled(disabled) {
  chatInput.disabled  = disabled;
  chatSend.disabled   = disabled;
  quickReplies.querySelectorAll('.quick-btn').forEach(btn => {
    btn.disabled = disabled;
  });
}

function setupNavHighlight() {
  const sections = [
    { id: 'dashboard', link: document.querySelector('a[href="#dashboard"]') },
    { id: 'checklist', link: document.querySelector('a[href="#checklist"]') },
    { id: 'buddy',     link: document.querySelector('a[href="#buddy"]') }
  ].filter(s => s.link);

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          sections.forEach(function (s) {
            s.link.classList.toggle('active', s.id === entry.target.id);
          });
        }
      });
    },
    { rootMargin: '-50% 0px -50% 0px' }
  );

  sections.forEach(function (s) {
    const el = document.getElementById(s.id);
    if (el) observer.observe(el);
  });
}

(function injectTypingDotStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .typing-dots {
      display: flex;
      gap: 5px;
      align-items: center;
      height: 20px;
      padding: 2px 0;
    }
    .typing-dots span {
      display: inline-block;
      width: 7px;
      height: 7px;
      background: #8FA98B;
      border-radius: 50%;
      animation: typingBounce 1.2s ease-in-out infinite;
    }
    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
      30%            { transform: translateY(-6px); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
})();

document.addEventListener('DOMContentLoaded', init);
