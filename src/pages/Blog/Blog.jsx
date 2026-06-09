import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../../data/blogData';
import './Blog.css';

export default function Blog() {
  const { lang } = useBooking();
  const navigate = useNavigate();
  const ar = lang === 'ar';

  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    document.title = ar ? 'SkyFly - المدونة' : 'SkyFly - Blog';
  }, [ar]);

  const filteredPosts = useMemo(() => {
    if (!activeCategory) return BLOG_POSTS;
    return BLOG_POSTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const handleCategoryClick = (catId) => {
    setActiveCategory(prev => prev === catId ? null : catId);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    if (ar) {
      return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="sky-blog sky-page">
      <section className="sky-blog__hero">
        <div className="sky-container">
          <div className="sky-blog__hero-content">
            <span className="sky-blog__hero-emoji">📝</span>
            <h1 className="sky-h1">
              {ar ? 'مدونة SkyFly مصر' : 'SkyFly Egypt Blog'}
            </h1>
            <p>
              {ar
                ? 'نصائح السفر، وجهات سياحية، وأخبار الطيران من مصر وإلى العالم'
                : 'Travel tips, destinations, and aviation news from Egypt to the world'}
            </p>
          </div>
        </div>
      </section>

      <section className="sky-section sky-blog__body">
        <div className="sky-container">
          <div className="sky-blog__categories">
            <button
              className={`sky-blog__cat-pill ${activeCategory === null ? 'sky-blog__cat-pill--active' : ''}`}
              onClick={() => setActiveCategory(null)}
            >
              {ar ? 'الكل' : 'All'}
            </button>
            {BLOG_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`sky-blog__cat-pill ${activeCategory === cat.id ? 'sky-blog__cat-pill--active' : ''}`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{ar ? cat.label : cat.labelEn}</span>
              </button>
            ))}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="sky-blog__empty">
              <span className="sky-blog__empty-icon">📭</span>
              <p>{ar ? 'لا توجد مقالات في هذا التصنيف' : 'No posts in this category'}</p>
              <button className="sky-btn sky-btn-ghost sky-btn-sm" onClick={() => setActiveCategory(null)}>
                {ar ? 'عرض الكل' : 'View All'}
              </button>
            </div>
          ) : (
            <div className="sky-blog__grid">
              {filteredPosts.map(post => (
                <article
                  key={post.id}
                  className="sky-blog__card sky-card"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={e => e.key === 'Enter' && navigate(`/blog/${post.slug}`)}
                >
                  <div className="sky-blog__card-image-wrap">
                    <img
                      src={post.image}
                      alt={ar ? post.title : post.titleEn}
                      className="sky-blog__card-image"
                      loading="lazy"
                    />
                    <span className="sky-blog__card-badge sky-badge sky-badge-primary">
                      {ar ? post.categoryLabel : post.categoryLabelEn}
                    </span>
                  </div>
                  <div className="sky-blog__card-body">
                    <h3 className="sky-h4 sky-blog__card-title">
                      {ar ? post.title : post.titleEn}
                    </h3>
                    <p className="sky-blog__card-excerpt">
                      {ar ? post.excerpt : post.excerptEn}
                    </p>
                    <div className="sky-blog__card-meta">
                      <div className="sky-blog__card-author">
                        <span className="sky-blog__card-author-avatar">
                          {ar ? post.author.charAt(0) : post.authorEn.charAt(0)}
                        </span>
                        <span>{ar ? post.author : post.authorEn}</span>
                      </div>
                      <span className="sky-blog__card-date">{formatDate(post.date)}</span>
                    </div>
                    <div className="sky-blog__card-footer">
                      <span className="sky-blog__card-read-time">
                        ⏱ {ar ? `${post.readTime} دقائق` : `${post.readTime} min read`}
                      </span>
                      <div className="sky-blog__card-tags">
                        {(ar ? post.tags : post.tagsEn).slice(0, 2).map((tag, i) => (
                          <span key={i} className="sky-blog__card-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
