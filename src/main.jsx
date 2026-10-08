import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const experiences = [
  { title: 'حكاية الزيتون', region: 'الجوف', image: 'olives.webp' },
  { title: 'موسم الورد', region: 'الطائف', image: 'roses.webp' },
  { title: 'يوم بين النخيل', region: 'الأحساء', image: 'ahsa.jpg' },
];
const farms = [
  { title: 'مزرعة السدر', region: 'الرياض', image: 'palms.jpg' },
  { title: 'مزرعة النخيل', region: 'القصيم', image: 'ahsa.jpg' },
  { title: 'مزرعة الوادي', region: 'الأحساء', image: 'wadi.jpg' },
];
const links = [['الرئيسية', '#home'], ['التجارب', '#experiences'], ['المناطق', '#farms'], ['تواصل معنا', '#contact']];
function Location({ children }) {
  return <p className="location"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-7.1 7-13A7 7 0 0 0 5 8c0 5.9 7 13 7 13Z"/><circle cx="12" cy="8" r="2.5"/></svg>{children}</p>;
}
function App() {
  const [slide, setSlide] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const ordered = experiences.map((_, i) => experiences[(i + slide) % experiences.length]);
  const visibleFarms = farms.filter(f => `${f.title} ${f.region}`.includes(query.trim()));
  return <div className="site" id="home">
    <header className="header">
      <a href="#home" aria-label="من هنا، الرئيسية"><img className="logo" src="/images/logo.png" alt="شعار من هنا" /></a>
      <div className="header-actions"><button className="search-button" aria-label="البحث عن مزرعة" aria-expanded={searchOpen} onClick={() => setSearchOpen(!searchOpen)}><svg viewBox="0 0 24 24" fill="none"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></svg></button><a className="button olive" href="#farms">احجز التجربة</a></div>
    </header>
    {searchOpen && <form className="search-form" onSubmit={e => { e.preventDefault(); document.getElementById('farms').scrollIntoView({ behavior: 'smooth' }); }}><label htmlFor="farm-search">ابحث عن مزرعة أو منطقة</label><input id="farm-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="اسم المزرعة أو المنطقة" autoFocus /><button className="button olive">بحث</button></form>}
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <nav className="hero-nav" aria-label="التنقل الرئيسي">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
        <div className="hero-content"><h1 id="hero-title">اكتشف السعودية من أهلها</h1><p>تجارب حقيقية تبدأ من مزارعنا<br/>وتحكي قصصًا من أهلها</p><a className="button orange" href="#experiences">اكتشف التجارب</a></div>
      </section>
      <section className="about" aria-labelledby="about-title"><div className="about-copy"><h2 id="about-title">من هنا</h2><p>من هنا منصة تجمع المزارع السعودية الخاصة وتحولها إلى تجارب سياحية يعيشها الزائر مع أهل المكان، ويتعرف من خلالها على ثقافة كل منطقة وتفاصيلها بطريقة مختلفة.</p></div><div className="saudi-map" role="img" aria-label="مناظر مزارع عسير داخل خريطة السعودية" /></section>
      <section className="experiences" id="experiences" aria-labelledby="experiences-title"><h2 id="experiences-title">اكتشف تجارب متنوعة</h2><div className="experience-grid">{ordered.map(e => <button className="experience-card" key={e.title} onClick={() => setSelected(e)}><img src={`/images/${e.image}`} alt={e.title} loading="lazy"/><div className="experience-info"><h3>{e.title}</h3><Location>{e.region}</Location></div></button>)}</div><div className="carousel-dots" aria-label="عرض التجارب">{experiences.map((_, i) => <button key={i} aria-label={`عرض المجموعة ${i + 1}`} aria-pressed={slide === i} className={slide === i ? 'active' : ''} onClick={() => setSlide(i)} />)}</div></section>
      <section className="how" aria-labelledby="how-title"><h2 id="how-title">كيف تعمل من هنا</h2><div className="steps">{[['اختر', 'اختر المنطقة أو نوع التجربة التي تناسبك'], ['اكتشف', 'تعرّف على المنطقة والتجربة اللي يرويها أهلها'], ['عش', 'احجز تجربتك واذهب لتعيشها بنفسك']].map(([title, description], i) => <article key={title}><span className="step-number">{i + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>
      <section className="farms" id="farms" aria-labelledby="farms-title"><h2 id="farms-title">اكتشف المزارع</h2><p className="section-subtitle">مزارع مختلفة من جميع المناطق</p><div className="farm-grid">{visibleFarms.map(f => <article className="farm-card" key={f.title}><img src={`/images/${f.image}`} alt={f.title} loading="lazy"/><div className="farm-info"><h3>{f.title}</h3><Location>{f.region}</Location><button className="button olive" onClick={() => setSelected(f)}>اكتشف التجربة</button></div></article>)}</div>{!visibleFarms.length && <p className="empty">لا توجد مزارع تطابق البحث. جرّب اسم منطقة أخرى.</p>}</section>
    </main>
    <footer id="contact"><div className="footer-top"><a className="wordmark" href="#home">من هنا<img src="/images/logo.png" alt="" /></a><nav aria-label="روابط التذييل">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav></div><div className="copyright"><span/>جميع الحقوق محفوظة<span/></div></footer>
    {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={e => e.stopPropagation()} onKeyDown={e => { if (e.key === 'Escape') setSelected(null); }}><button className="modal-close" aria-label="إغلاق" onClick={() => setSelected(null)} autoFocus>×</button><img src={`/images/${selected.image}`} alt={selected.title}/><h2 id="modal-title">{selected.title}</h2><Location>{selected.region}</Location><p>تجربة من أرضنا، تكتشف فيها المزرعة وحكايات أهلها.</p><p className="booking-note">تفاصيل التجربة والحجز ستتوفر قريبًا.</p><button className="button olive" onClick={() => setSelected(null)}>العودة إلى المزارع</button></section></div>}
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
