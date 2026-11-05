import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Navigation
    nav_home: 'Home',
    nav_store: 'Meklit Store',
    nav_media: 'Music & Sermons',
    nav_about: 'About Us',
    nav_contact: 'Contact',
    nav_login: 'Log In',
    nav_join: 'Join',
    nav_logout: 'Log Out',
    nav_profile: 'Profile',
    nav_admin: 'Admin Dashboard',
    church_name: 'Apostolic Church of Ethiopia',
    brand_sub: 'APOSTOLIC CHURCH OF ETHIOPIA',

    // Hero & Scripture
    hero_title: 'ACE MEKLIT & CONTENTS',
    hero_quote: '" Hear, O Israel: The LORD our GOD, The LORD is one. "',
    hero_verse: '( Deuteronomy 6:4 )',
    hero_sub: 'Scripture Thread • Living Word Apparel • Covenant Cotton • Verity Wear • Biblical Books & Apostolic Hymns',
    btn_shop: 'Shop ACE Meklit Store',
    btn_media: 'Listen to Gospel Music & Sermons',

    // Brand Pillars
    pillar_style_title: 'Purposeful Faith Style',
    pillar_style_desc: 'Weaving scripture and biblical identity into comfortable, high-quality contemporary apparel.',
    pillar_music_title: 'Anointed Gospel Songs',
    pillar_music_desc: 'Full gospel albums and Apostolic choir worship melodies that exalt Jesus Christ.',
    pillar_doctrine_title: 'Biblical Sound Doctrine',
    pillar_doctrine_desc: 'Sermons from Apostolic bishops and doctrinal books upholding holiness and the Word of God.',
    pillar_integrity_title: 'Integrity & Ministry',
    pillar_integrity_desc: 'Every purchase supports ministry outreach, church publishing, and Christian community support.',

    // Store
    store_title: 'ACE MEKLIT STORE',
    store_subtitle: 'Faith-Based Apparel & Merchandise',
    store_desc: 'Scripture Thread • Living Word Apparel • Covenant Cotton • Verity Wear • Biblical Books ...',
    store_search_placeholder: 'Search products by title, keyword, or scripture...',
    store_all: 'All',
    store_cat_logo: 'ACE Logo Products',
    store_cat_verse: 'Bible Verse Products',
    store_cat_books: 'Holy Bible Covers and Books',
    store_view_all: 'View All Store Products',
    store_add_cart: 'Add to Cart',
    store_view_details: 'View Details',
    store_in_stock: 'In Stock',
    store_out_stock: 'Out of Stock',
    store_price: 'Price',
    store_showing: 'Showing',
    store_items_in: 'items in',
    store_no_products: 'No products found',
    store_reset_filters: 'Reset Filters',

    // Media
    media_title: 'GOSPEL MUSIC & SERMONS',
    media_subtitle: 'Apostolic Songs & Teachings',
    media_desc: 'Stream full gospel albums and spirit-filled preaching from Apostolic Church of Ethiopia bishops and choirs.',
    media_all: 'All Content',
    media_music: '🎵 Full Album Musics',
    media_preaching: '📖 Apostolic Preachings',
    media_sec_music: '⇒ Full AlbumMusics',
    media_sec_preaching: '⇒ Best Preachings',
    media_watch: 'Watch on YouTube',

    // Cart & Checkout
    cart_title: 'Shopping Cart',
    cart_empty_title: 'Your Cart is Empty',
    cart_empty_desc: 'You haven’t added any ACE Meklit items yet.',
    cart_explore_store: 'Explore Meklit Store',
    cart_product_details: 'PRODUCT DETAILS',
    cart_clear: 'Clear Cart',
    cart_order_summary: 'Order Summary',
    cart_subtotal: 'Subtotal',
    cart_shipping: 'Estimated Shipping',
    cart_free: 'Free',
    cart_total: 'Total',
    cart_checkout: 'Proceed to Checkout',
    cart_continue_shopping: 'Continue Shopping',
    checkout_success_title: '✅ Thank you! You purchased Successfully',
    checkout_empty_alert: '⚠️ Please add Items to the cart first!',
    checkout_shipping_address: 'Shipping Address',
    checkout_full_name: 'Full Name',
    checkout_phone: 'Phone Number',
    checkout_delivery_address: 'Delivery Address',
    checkout_city: 'City',
    checkout_country: 'Country',
    checkout_payment_method: 'Payment Method',
    checkout_place_order: 'Place & Pay Order',

    // About & Contact
    about_title: 'ABOUT ACE MEKLIT',
    about_subtitle: 'Our Calling & Heritage',
    about_our_story: 'Our Story',
    about_story_title: 'Dedicated to Purposeful Style',
    about_commitment: 'Our Commitment',
    about_commitment_title: 'Quality and Integrity',
    contact_title: 'Contact ACE Meklit',
    contact_subtitle: 'Get In Touch',
    contact_name: 'Name',
    contact_email: 'Email',
    contact_message: 'Message',
    contact_submit: 'Submit',
    contact_success: '✅ Message sent successfully!',
    contact_error: '⚠️ Please fill in all fields!',

    // Auth
    login_welcome: 'Welcome Back',
    login_subtitle: 'Sign in to access your ACE Meklit account & orders',
    login_email: 'Email Address',
    login_password: 'Password',
    login_btn: 'Sign In',
    login_quick_demo: 'QUICK DEMO ACCOUNTS',
    login_demo_customer: 'Demo Customer',
    login_demo_admin: 'Demo Admin',
    login_no_account: "Don't have an account yet?",
    login_create_one: 'Create one now',

    register_title: 'Create an Account',
    register_subtitle: 'Join the ACE Meklit community for faith apparel and spiritual content',
    register_name: 'Full Name *',
    register_email: 'Email Address *',
    register_phone: 'Phone Number (Optional)',
    register_password: 'Password *',
    register_confirm_password: 'Confirm Password *',
    register_btn: 'Register Account',
    register_creating: 'Creating Account...',
    register_has_account: 'Already have an account?',
    register_sign_in: 'Sign In here',

    product_in_stock: 'In Stock',
    product_out_of_stock: 'Out of Stock',
    product_add_to_cart: 'Add to Cart',
    product_back: 'Back to Store',

    // Footer
    footer_rights: 'All rights reserved.',
    footer_quick_links: 'Navigation',
    footer_categories: 'Categories',
    footer_connect: 'Connect With Us',
  },
  am: {
    // Navigation
    nav_home: 'መነሻ',
    nav_store: 'የመክሊት መደብር',
    nav_media: 'መዝሙራት እና ስብከቶች',
    nav_about: 'ስለ እኛ',
    nav_contact: 'ያግኙን',
    nav_login: 'ይግቡ',
    nav_join: 'ይመዝገቡ',
    nav_logout: 'ውጣ',
    nav_profile: 'የግል መገለጫ',
    nav_admin: 'የአስተዳዳሪ ክፍል',
    church_name: 'የኢትዮጵያ ሐዋርያዊት ቤተክርስቲያን',
    brand_sub: 'የኢትዮጵያ ሐዋርያዊት ቤተክርስቲያን',

    // Hero & Scripture
    hero_title: 'የኢሐቤክ መክሊት እና ይዘቶች',
    hero_quote: '" ስማ እስራኤል ሆይ፤ አምላካችን እግዚአብሔር አንድ እግዚአብሔር ነው፤ "',
    hero_verse: '( ዘዳግም 6:4 )',
    hero_sub: 'የቅዱስ ቃል ልብሶች • የቃል ኪዳን ጥጥ • የእውነት ልብስ • ቅዱሳት መጻሕፍት እና ሐዋርያዊ ዝማሬዎች',
    btn_shop: 'የመክሊት መደብርን ይጎብኙ',
    btn_media: 'ወንጌላዊ መዝሙራትና ስብከቶችን ያዳምጡ',

    // Brand Pillars
    pillar_style_title: 'ዓላማ ያለው የዕምነት ፋሽን',
    pillar_style_desc: 'የመጽሐፍ ቅዱስ ቃልና ሐዋርያዊ ማንነትን ከዘመናዊ ጥራት ካላቸው ልብሶች ጋር ማስተሳሰር።',
    pillar_music_title: 'መንፈሳዊ የወንጌል መዝሙራት',
    pillar_music_desc: 'ኢየሱስ ክርስቶስን ከፍ የሚያደርጉ ሙሉ አልበም መዝሙራትና የሕብረት ዝማሬዎች።',
    pillar_doctrine_title: 'ትክክለኛ ሐዋርያዊ ትምህርት',
    pillar_doctrine_desc: 'የእግዚአብሔርን ቃልና ቅድስናን የሚያጸኑ የሐዋርያዊ ጳጳሳት ስብከቶችና መጻሕፍት።',
    pillar_integrity_title: 'ታማኝነትና አገልግሎት',
    pillar_integrity_desc: 'እያንዳንዱ ግዢ የወንጌል አገልግሎትን፣ የሕትመት ሥራንና ማኅበረሰብን ይደግፋል።',

    // Store
    store_title: 'የኢሐቤክ መክሊት መደብር',
    store_subtitle: 'የእምነት ልብሶች እና ንዋየ ቅድሳት',
    store_desc: 'የቅዱስ ቃል ልብሶች • የቃል ኪዳን ጥጥ • የእውነት ልብስ • ቅዱሳት መጻሕፍት ...',
    store_search_placeholder: 'ምርቶችን በስም፣ በቁልፍ ቃል ወይም በጥቅስ ይፈልጉ...',
    store_all: 'ሁሉም',
    store_cat_logo: 'የኢሐቤክ አርማ ምርቶች',
    store_cat_verse: 'የመጽሐፍ ቅዱስ ጥቅስ ምርቶች',
    store_cat_books: 'ቅዱስ መጽሐፍ ቅዱስ እና መጻሕፍት',
    store_view_all: 'ሁሉንም የመደብር ምርቶች ይመልከቱ',
    store_add_cart: 'ወደ ጋሪ ጨምር',
    store_view_details: 'ዝርዝር ይመልከቱ',
    store_in_stock: 'በክምችት አለ',
    store_out_stock: 'አልቋል',
    store_price: 'ዋጋ',
    store_showing: 'እየታዩ ያሉት',
    store_items_in: 'ምርቶች በ',
    store_no_products: 'ምንም የተገኘ ምርት የለም',
    store_reset_filters: 'ማጣሪያውን መልስ',

    // Media
    media_title: 'የወንጌል መዝሙራት እና ስብከቶች',
    media_subtitle: 'ሐዋርያዊ ዝማሬዎች እና ትምህርቶች',
    media_desc: 'በኢትዮጵያ ሐዋርያዊት ቤተክርስቲያን ዘማሪዎችና ጳጳሳት የተዘጋጁ መንፈሳዊ መዝሙራትና ስብከቶችን በቀጥታ ያዳምጡ።',
    media_all: 'ሁሉንም ይዘቶች',
    media_music: '🎵 ሙሉ አልበም መዝሙራት',
    media_preaching: '📖 ሐዋርያዊ ስብከቶች',
    media_sec_music: '⇒ ሙሉ አልበም መዝሙራት',
    media_sec_preaching: '⇒ ምርጥ ስብከቶች',
    media_watch: 'በዩቲዩብ ይመልከቱ',

    // Cart & Checkout
    cart_title: 'የግዢ ጋሪ',
    cart_empty_title: 'የግዢ ጋሪዎ ባዶ ነው',
    cart_empty_desc: 'እስካሁን ምንም የመክሊት ዕቃ አልመረጡም።',
    cart_explore_store: 'ወደ መደብር ሂድ',
    cart_product_details: 'የምርት ዝርዝሮች',
    cart_clear: 'ጋሪውን አጽዳ',
    cart_order_summary: 'የትዕዛዝ ማጠቃለያ',
    cart_subtotal: 'የእቃዎች ድምር',
    cart_shipping: 'የትራንስፖርት ክፍያ',
    cart_free: 'ነጻ',
    cart_total: 'አጠቃላይ ድምር',
    cart_checkout: 'ወደ ክፍያ ሂድ',
    cart_continue_shopping: 'ግዢውን ቀጥል',
    checkout_success_title: '✅ እናመሰግናለን! በተሳካ ሁኔታ ገዝተዋል',
    checkout_empty_alert: '⚠️ እባክዎ መጀመሪያ እቃዎችን ወደ ጋሪው ይጨምሩ!',
    checkout_shipping_address: 'የማድረሻ አድራሻ',
    checkout_full_name: 'ሙሉ ስም',
    checkout_phone: 'ስልክ ቁጥር',
    checkout_delivery_address: 'የሚደርስበት አድራሻ',
    checkout_city: 'ከተማ',
    checkout_country: 'ሀገር',
    checkout_payment_method: 'የመክፈያ ዘዴ',
    checkout_place_order: 'እዘዝ እና ክፈል',

    // About & Contact
    about_title: 'ስለ ኢሐቤክ መክሊት',
    about_subtitle: 'ጥሪያችን እና ቅርሳችን',
    about_our_story: 'ታሪካችን',
    about_story_title: 'ዓላማ ላለው የእምነት ፋሽን የተተጋ',
    about_commitment: 'የእኛ ቃል ኪዳን',
    about_commitment_title: 'ጥራት እና ታማኝነት',
    contact_title: 'ኢሐቤክ መክሊትን ያግኙ',
    contact_subtitle: 'መልእክት ይላኩልን',
    contact_name: 'ስም',
    contact_email: 'ኢሜይል',
    contact_message: 'መልእክት',
    contact_submit: 'ላክ',
    contact_success: '✅ መልእክትዎ በተሳካ ሁኔታ ተልኳል!',
    contact_error: '⚠️ እባክዎ ሁሉንም ክፍሎች ይሙሉ!',

    // Auth
    login_welcome: 'እንኳን ደህና መጡ',
    login_subtitle: 'ወደ ኢሐቤክ መክሊት መለያዎ ለመግባት መረጃዎን ያስገቡ',
    login_email: 'ኢሜይል አድራሻ',
    login_password: 'የይለፍ ቃል',
    login_btn: 'ግባ',
    login_quick_demo: 'የሙከራ መለያዎች',
    login_demo_customer: 'የሙከራ ደንበኛ',
    login_demo_admin: 'የሙከራ አስተዳዳሪ',
    login_no_account: 'መለያ የለዎትም?',
    login_create_one: 'አሁን ይመዝገቡ',

    register_title: 'መለያ ይፍጠሩ',
    register_subtitle: 'የእምነት አልባሳትና መንፈሳዊ ይዘቶችን ለማግኘት የኢሐቤክ መክሊት አባል ይሁኑ',
    register_name: 'ሙሉ ስም *',
    register_email: 'ኢሜይል አድራሻ *',
    register_phone: 'ስልክ ቁጥር (አስገዳጅ ያልሆነ)',
    register_password: 'የይለፍ ቃል *',
    register_confirm_password: 'የይለፍ ቃል አረጋግጥ *',
    register_btn: 'ይመዝገቡ',
    register_creating: 'በመመዝገብ ላይ...',
    register_has_account: 'ቀደም ሲል መለያ አለዎት?',
    register_sign_in: 'እዚህ ይግቡ',

    product_in_stock: 'በመደብር ውስጥ አለ',
    product_out_of_stock: 'አልቋል',
    product_add_to_cart: 'ወደ ጋሪ ጨምር',
    product_back: 'ወደ መደብር ተመለስ',

    // Footer
    footer_rights: 'መብቱ በሕግ የተጠበቀ ነው።',
    footer_quick_links: 'አሰሳ',
    footer_categories: 'የምርት ዓይነቶች',
    footer_connect: 'ይከተሉን',
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('aceMeklitLang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('aceMeklitLang', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'am' : 'en'));
  };

  const t = (key, fallback = '') => {
    const langDict = translations[language] || translations.en;
    if (langDict[key] !== undefined) {
      return langDict[key];
    }
    if (translations.en[key] !== undefined) {
      return translations.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
