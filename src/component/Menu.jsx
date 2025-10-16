import { useState, useEffect } from 'react';
import MenuService from '../services/menuService';
import './menu.css'; // Make sure this path is correct

const FIXED_CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'special', label: 'Sagar Garrie Special' },
  { id: 'starters', label: 'Starters' },
  { id: 'main', label: 'Main Course' },
  { id: 'beverages', label: 'Beverages' }
];

const rupee = (v) => `₹ ${Number(v).toFixed(0)}`;

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await MenuService.getAllMenuItems();
        if (res.success) {
          setMenuItems(res.data || []);
        } else {
          setError(res.error || 'Failed to load menu');
        }
      } catch (e) {
        console.error(e);
        setError('Unexpected error loading menu');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const markIsSpecial = (item) => {
    const c = (item.category || '').toLowerCase();
    return c.includes('special') || (item.tags && item.tags.includes('special'));
  };

  const filtered = menuItems.filter(item => {
    // category filter
    if (activeCategory === 'special' && !markIsSpecial(item)) return false;
    if (activeCategory === 'starters' && !(item.category || '').toLowerCase().includes('starter')) return false;
    if (activeCategory === 'main' && !( (item.category || '').toLowerCase().includes('main') || (item.category || '').toLowerCase().includes('course') )) return false;
    if (activeCategory === 'beverages' && !(item.category || '').toLowerCase().includes('beverage')) return false;
    // search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!(
        (item.name || '').toLowerCase().includes(term) ||
        (item.description || '').toLowerCase().includes(term) ||
        (item.category || '').toLowerCase().includes(term)
      )) return false;
    }
    return true;
  });

  if (loading) {
    return <div className="menu-loading">Loading menu…</div>;
  }
  if (error) {
    return <div className="menu-error">Error: {error}</div>;
  }

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1 className="menu-title">OUR MENU</h1>
        <div className="menu-search">
          <input
            aria-label="Search menu"
            type="search"
            placeholder="Search dishes, ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="menu-search-input"
          />
        </div>
      </div>

      <nav className="menu-cats" role="tablist" aria-label="Menu categories">
        {FIXED_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`menu-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      <section className="menu-grid">
        {filtered.length === 0 ? (
          <div className="menu-empty">No items found.</div>
        ) : (
          filtered.map(item => (
            <article key={item.id} className="menu-card">
              <div className="menu-card-media">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="menu-image" />
                ) : (
                  <div className="menu-image-placeholder">Image will be added</div>
                )}
              </div>

              <div className="menu-card-body">
                <div className="menu-card-top">
                  <h3 className="menu-item-name">{item.name}</h3>
                  <div className="menu-item-price">{rupee(item.price)}</div>
                </div>

                <p className="menu-item-desc">{item.description || 'Delicious & freshly prepared.'}</p>

                <div className="menu-card-meta">
                  { (item.veg || item.isVegetarian) && <span className="menu-tag veg">Veg</span> }
                  { markIsSpecial(item) && <span className="menu-tag special">Special</span> }
                  <span className="menu-category">{item.category}</span>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      {/* Footer / CTA consistent with Home */}
      <footer className="menu-footer">
        <div className="menu-footer-cta">
          <a href="/BookingForm" className="menu-footer-btn primary">Book Your Table</a>
          <a href="/menu" className="menu-footer-btn secondary">View Full Menu</a>
        </div>
        <p className="menu-footer-line">
          Experience the authentic flavors and warm hospitality that keep our guests coming back!
        </p>
      </footer>
    </div>
  );
};

export default Menu;
