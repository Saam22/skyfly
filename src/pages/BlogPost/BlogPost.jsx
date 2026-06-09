import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { BLOG_POSTS } from '../../data/blogData';
import './BlogPost.css';

export default function BlogPost() {
  const { lang } = useBooking();
  const { slug } = useParams();
  const navigate = useNavigate();
  const ar = lang === 'ar';

  const post = BLOG_POSTS.find(p => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = ar ? `SkyFly - ${post.title}` : `SkyFly - ${post.titleEn}`;
    } else {
      document.title = ar ? 'SkyFly - المقال غير موجود' : 'SkyFly - Post Not Found';
    }
  }, [post, ar]);

  if (!post) {
    return (
      <div className="sky-blog-post sky-page">
        <div className="sky-container">
          <div className="sky-blog-post__not-found">
            <span className="sky-blog-post__not-found-icon">🔍</span>
            <h1 className="sky-h2">
              {ar ? 'المقال غير موجود' : 'Post Not Found'}
            </h1>
            <p>
              {ar
                ? 'عذراً، لم نتمكن من العثور على المقال الذي تبحث عنه'
                : 'Sorry, we couldn\'t find the post you\'re looking for'}
            </p>
            <Link to="/blog" className="sky-btn sky-btn-primary">
              ← {ar ? 'العودة إلى المدونة' : 'Back to Blog'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    if (ar) {
      return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const renderContent = (item, i) => {
    switch (item.type) {
      case 'heading':
        return <h2 key={i} className="sky-blog-post__heading">{item.value}</h2>;
      case 'text':
        return <p key={i} className="sky-blog-post__text">{item.value}</p>;
      case 'image':
        return (
          <figure key={i} className="sky-blog-post__figure">
            <img src={item.value} alt={item.caption || ''} className="sky-blog-post__image" />
            {item.caption && <figcaption>{item.caption}</figcaption>}
          </figure>
        );
      case 'list':
        return (
          <ul key={i} className="sky-blog-post__list">
            {item.value.map((li, j) => (
              <li key={j}>{li}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  const relatedPosts = BLOG_POSTS.filter(
    p => p.category === post.category && p.id !== post.id
  ).slice(0, 3);

  return (
    <div className="sky-blog-post sky-page">
      {/* Hero */}
      <section className="sky-blog-post__hero">
        <img
          src={post.image}
          alt={ar ? post.title : post.titleEn}
          className="sky-blog-post__hero-image"
        />
        <div className="sky-blog-post__hero-overlay" />
        <div className="sky-container sky-blog-post__hero-content">
          <Link to="/blog" className="sky-blog-post__back-btn">
            ← {ar ? 'العودة إلى المدونة' : 'Back to Blog'}
          </Link>
          <div className="sky-blog-post__hero-info">
            <span className="sky-badge sky-badge-primary">
              {ar ? post.categoryLabel : post.categoryLabelEn}
            </span>
            <h1 className="sky-h1">
              {ar ? post.title : post.titleEn}
            </h1>
            <div className="sky-blog-post__hero-meta">
              <div className="sky-blog-post__author">
                <span className="sky-blog-post__author-avatar">
                  {ar ? post.author.charAt(0) : post.authorEn.charAt(0)}
                </span>
                <span>{ar ? post.author : post.authorEn}</span>
              </div>
              <span className="sky-blog-post__meta-divider">•</span>
              <span>{formatDate(post.date)}</span>
              <span className="sky-blog-post__meta-divider">•</span>
              <span>⏱ {ar ? `${post.readTime} دقائق` : `${post.readTime} min read`}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="sky-section sky-blog-post__body">
        <div className="sky-container sky-blog-post__container">
          <div className="sky-blog-post__content">
            {post.content.map((item, i) => renderContent(item, i))}
          </div>

          {/* Tags */}
          {post.tags && (
            <div className="sky-blog-post__tags">
              <span className="sky-blog-post__tags-label">
                {ar ? 'الوسوم:' : 'Tags:'}
              </span>
              <div className="sky-blog-post__tags-list">
                {(ar ? post.tags : post.tagsEn).map((tag, i) => (
                  <span key={i} className="sky-blog-post__tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Author Box */}
          <div className="sky-blog-post__author-box sky-card">
            <div className="sky-blog-post__author-box-avatar">
              {ar ? post.author.charAt(0) : post.authorEn.charAt(0)}
            </div>
            <div>
              <strong>{ar ? post.author : post.authorEn}</strong>
              <p>
                {ar
                  ? 'كاتب محتوى في SkyFly مصر - يشاركك نصائح السفر وأخبار الطيران'
                  : 'Content writer at SkyFly Egypt - sharing travel tips and aviation news'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="sky-section sky-blog-post__related">
          <div className="sky-container">
            <div className="sky-section-header">
              <h2 className="sky-h2">
                {ar ? 'مقالات ذات صلة' : 'Related Posts'}
              </h2>
            </div>
            <div className="sky-blog-post__related-grid">
              {relatedPosts.map(rp => (
                <article
                  key={rp.id}
                  className="sky-blog-post__related-card sky-card"
                  onClick={() => navigate(`/blog/${rp.slug}`)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={e => e.key === 'Enter' && navigate(`/blog/${rp.slug}`)}
                >
                  <div className="sky-blog-post__related-image-wrap">
                    <img
                      src={rp.image}
                      alt={ar ? rp.title : rp.titleEn}
                      className="sky-blog-post__related-image"
                      loading="lazy"
                    />
                  </div>
                  <div className="sky-blog-post__related-body">
                    <span className="sky-badge sky-badge-primary">
                      {ar ? rp.categoryLabel : rp.categoryLabelEn}
                    </span>
                    <h3 className="sky-h4">
                      {ar ? rp.title : rp.titleEn}
                    </h3>
                    <p>{ar ? rp.excerpt : rp.excerptEn}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="sky-section sky-blog-post__cta">
        <div className="sky-container">
          <div className="sky-blog-post__cta-card sky-card">
            <h2 className="sky-h3">
              {ar ? 'هل أنت مستعد لرحلتك القادمة؟' : 'Ready for your next trip?'}
            </h2>
            <p>
              {ar
                ? 'احجز رحلتك من مصر مع SkyFly واستمتع بأفضل الأسعار والخدمات'
                : 'Book your trip from Egypt with SkyFly and enjoy the best prices and services'}
            </p>
            <div className="sky-blog-post__cta-buttons">
              <Link to="/search" className="sky-btn sky-btn-primary">
                🔍 {ar ? 'ابحث عن رحلتك' : 'Search Flights'}
              </Link>
              <Link to="/blog" className="sky-btn sky-btn-ghost">
                ← {ar ? 'المزيد من المقالات' : 'More Articles'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
