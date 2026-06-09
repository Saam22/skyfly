import { useState, useRef, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import './LiveChat.css';

const AUTO_REPLIES = [
  { keywords: ['مرحبا', 'السلام', 'hi', 'hello'], reply: 'أهلاً بك في SkyFly! كيف يمكنني مساعدتك؟ 👋' },
  { keywords: ['حجز', 'booking', 'reserve'], reply: 'لحجز رحلة جديدة، يمكنك استخدام شريط البحث في الصفحة الرئيسية أو الضغط على زر "ابحث الآن"' },
  { keywords: ['إلغاء', 'cancel', 'refund'], reply: 'لإلغاء الحجز، اذهب إلى صفحة "رحلاتي" واضغط على زر الإلغاء بجانب الحجز الذي ترغب في إلغائه.' },
  { keywords: ['سعر', 'price', 'السعر'], reply: 'نعرض أفضل الأسعار من جميع الخطوط الجوية. يمكنك مقارنة الأسعار في صفحة نتائج البحث.' },
  { keywords: ['مقعد', 'seat', 'seats'], reply: 'يمكنك اختيار مقعدك من خلال خريطة المقاعد التفاعلية في صفحة إتمام الحجز.' },
  { keywords: ['شكر', 'thanks', 'thank you'], reply: 'نشكرك على تواصلك! هل هناك أي شيء آخر يمكنني مساعدتك به؟ 😊' },
];

export default function LiveChat() {
  const { lang } = useBooking();
  const ar = lang === 'ar';
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{
    from: 'bot',
    text: ar ? '👋 مرحباً بك في SkyFly! كيف يمكنني مساعدتك؟' : '👋 Welcome to SkyFly! How can I help you?',
  }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { from: 'user', text }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      const match = AUTO_REPLIES.find(r => r.keywords.some(k => lower.includes(k)));
      const reply = match
        ? match.reply
        : ar
          ? 'شكراً لتواصلك. سيقوم أحد ممثلي الدعم بالرد عليك قريباً.'
          : 'Thank you for reaching out. A support representative will get back to you shortly.';
      setMessages(prev => [...prev, { from: 'bot', text: reply }]);
      setTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        id="live-chat-btn"
        className={`sky-chat-btn ${open ? 'sky-chat-btn--open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={ar ? 'الدردشة المباشرة' : 'Live chat'}
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="sky-chat-window sky-animate-fade">
          <div className="sky-chat-header">
            <div className="sky-chat-header-info">
              <span className="sky-chat-header-icon">💬</span>
              <div>
                <strong>{ar ? 'الدعم المباشر' : 'Live Support'}</strong>
                <small>{ar ? 'نحن هنا لمساعدتك' : 'We are here to help'}</small>
              </div>
            </div>
            <div className="sky-chat-status">
              <span className="sky-chat-status-dot" />
              <span>{ar ? 'متصلون' : 'Online'}</span>
            </div>
          </div>

          <div className="sky-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`sky-chat-msg sky-chat-msg--${msg.from}`}>
                {msg.text}
              </div>
            ))}
            {typing && (
              <div className="sky-chat-msg sky-chat-msg--bot sky-chat-typing">
                <span className="sky-chat-typing-dot" />
                <span className="sky-chat-typing-dot" />
                <span className="sky-chat-typing-dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="sky-chat-input-wrap">
            <input
              id="chat-input"
              className="sky-chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={ar ? 'اكتب رسالتك...' : 'Type your message...'}
            />
            <button
              id="chat-send-btn"
              className="sky-chat-send"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
