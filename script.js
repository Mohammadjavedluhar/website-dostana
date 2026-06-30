/* ==========================================================================
   NAVIGATION & HEADER INTERACTION
   ========================================================================== */
const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Sticky Header on Scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    highlightNavLink();
});

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
    } else {
        icon.className = 'fa-solid fa-bars';
    }
});

// Close Mobile Menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
    });
});

// Highlight Navigation Link on Scroll
function highlightNavLink() {
    const scrollPosition = window.scrollY + 100;
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/* ==========================================================================
   PRODUCT FILTERING (TABS)
   ========================================================================== */
function filterProducts(category) {
    // Update active tab button
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(category)) {
            btn.classList.add('active');
        }
    });

    // Filter cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transition = 'opacity 0.4s ease';
            }, 50);
        } else {
            card.style.display = 'none';
        }
    });
}

/* ==========================================================================
   PRODUCT SPECIFICATIONS DATA & MODAL
   ========================================================================== */
const specsModal = document.getElementById('specsModal');
const specsTitle = document.getElementById('specsTitle');
const specsTableBody = document.getElementById('specsTableBody');

function openDynamicSpecsModal(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    specsTitle.innerText = product.titleHi + ' तकनीकी विवरण';
    specsTableBody.innerHTML = '';
    
    for (const [key, val] of Object.entries(product.specs)) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-weight: 600; color: var(--primary-green-dark);">${key}</td>
            <td>${val}</td>
        `;
        specsTableBody.appendChild(row);
    }
    
    specsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSpecsModal() {
    specsModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

/* ==========================================================================
   GET QUOTE MODAL CONTROLS
   ========================================================================== */
const quoteModal = document.getElementById('quoteModal');
const modalTrolleySelect = document.getElementById('modalTrolley');

function openQuoteModal(trolleyName = '') {
    if (trolleyName) {
        const cleanName = trolleyName.toLowerCase().replace('trolley', '').replace('कस्टमाइज्ड', '').trim();
        for (let i = 0; i < modalTrolleySelect.options.length; i++) {
            const optionVal = modalTrolleySelect.options[i].value.toLowerCase();
            if (optionVal.includes(cleanName)) {
                modalTrolleySelect.selectedIndex = i;
                break;
            }
        }
    }
    quoteModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeQuoteModal() {
    quoteModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modals when clicking outside the modal content
window.addEventListener('click', (e) => {
    if (e.target === quoteModal) {
        closeQuoteModal();
    }
    if (e.target === specsModal) {
        closeSpecsModal();
    }
    if (e.target === document.getElementById('adminLoginModal')) {
        closeAdminLoginModal();
    }
    if (e.target === document.getElementById('adminDashboardModal')) {
        closeAdminDashboardModal();
    }
});

/* ==========================================================================
   GALLERY LIGHTBOX CONTROLS
   ========================================================================== */
const lightbox = document.getElementById('galleryLightbox');
const lightboxImg = document.getElementById('lightboxImg');

function openLightbox(imgSrc) {
    lightboxImg.src = imgSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

/* ==========================================================================
   FORM SUBMISSION & TOAST NOTIFICATION
   ========================================================================== */
const toast = document.getElementById('toastNotification');
const toastTitle = document.getElementById('toastTitle');
const toastMessage = document.getElementById('toastMessage');

function showToast(title, msg, isError = false) {
    toastTitle.innerText = title;
    toastMessage.innerText = msg;
    
    const toastIcon = toast.querySelector('.toast-icon');
    
    if (isError) {
        toast.style.borderLeftColor = '#dc2f02';
        if (toastIcon) {
            toastIcon.className = 'fa-solid fa-circle-exclamation toast-icon';
            toastIcon.style.color = '#dc2f02';
        }
    } else {
        toast.style.borderLeftColor = '#25d366';
        if (toastIcon) {
            toastIcon.className = 'fa-solid fa-circle-check toast-icon';
            toastIcon.style.color = '#25d366';
        }
    }
    
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 4500);
}

// Handle Quote Form Submit
function handleQuoteSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('modalName').value;
    const phone = document.getElementById('modalPhone').value;
    const location = document.getElementById('modalLocation').value;
    const trolley = modalTrolleySelect.options[modalTrolleySelect.selectedIndex].text;
    
    console.log('Quote Request:', { name, phone, location, trolley });
    closeQuoteModal();
    document.getElementById('quoteForm').reset();
    
    showToast(
        'कोटेशन अनुरोध प्राप्त हुआ!',
        `धन्यवाद ${name}, ${trolley} के लिए आपका अनुरोध दर्ज कर लिया गया है। हम जल्द ही संपर्क करेंगे।`
    );
}

// Handle Contact Form Submit
function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('fullName').value;
    const phone = document.getElementById('phoneNum').value;
    const location = document.getElementById('location').value;
    const trolleySelect = document.getElementById('trolleyType');
    const trolley = trolleySelect.value ? trolleySelect.options[trolleySelect.selectedIndex].text : 'सामान्य पूछताछ';
    const message = document.getElementById('message').value;
    
    console.log('Inquiry Submit:', { name, phone, location, trolley, message });
    document.getElementById('contactForm').reset();
    
    showToast(
        'पूछताछ सफलता पूर्वक भेजी गई!',
        `प्रिय ${name}, आपका संदेश दोस्ताना इंजीनियरिंग तक पहुंच गया है। हमारे प्रतिनिधि आपसे संपर्क करेंगे।`
    );
}

/* ==========================================================================
   DYNAMIC DATA LOADING (API INTEGRATION)
   ========================================================================== */
let productsData = [];
let galleryData = [];

// API Request Headers with auth token
const API_HEADERS = () => {
    const token = localStorage.getItem('dostana_admin_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

// Load products from API
async function loadProducts() {
    try {
        const res = await fetch('/api/products');
        productsData = await res.json();
        renderProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Render products to public grid
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    productsData.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', product.category);
        
        // Generate specs HTML
        let specsHtml = '';
        for (const [key, val] of Object.entries(product.specs)) {
            specsHtml += `<div class="spec-item"><span class="spec-name">${key}:</span> <span class="spec-val">${val}</span></div>`;
        }
        
        card.innerHTML = `
            <div class="product-img-wrapper">
                <img src="${product.image}" alt="${product.titleEn}" class="product-img">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title-hi">${product.titleHi}</h3>
                <h4 class="product-title-en">${product.titleEn}</h4>
                <p class="product-desc">${product.desc}</p>
                
                <div class="product-specs">
                    ${specsHtml}
                </div>
                
                <div class="product-footer">
                    <div class="product-price">
                        <span class="price-label">अनुमानित कीमत:</span>
                        <span class="price-val">${product.price}</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary btn-sm" onclick="openQuoteModal('${product.titleEn}')">Book Now</button>
                        <button class="btn btn-outline btn-sm" onclick="openDynamicSpecsModal('${product.id}')">Specs</button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    
    // Trigger initial filter to show correct tab
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        const onclickAttr = activeTab.getAttribute('onclick');
        if (onclickAttr) {
            const match = onclickAttr.match(/'([^']+)'/);
            if (match) filterProducts(match[1]);
        }
    }
}

// Load gallery from API
async function loadGallery() {
    try {
        const res = await fetch('/api/gallery');
        galleryData = await res.json();
        renderGallery();
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

// Render gallery to public grid
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    galleryData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.onclick = () => openLightbox(item.image);
        
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="gallery-overlay">
                <i class="fa-solid fa-magnifying-glass-plus"></i>
                <span>${item.title}</span>
            </div>
        `;
        grid.appendChild(div);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadGallery();
});

/* ==========================================================================
   ADMIN PANEL & DASHBOARD LOGIC
   ========================================================================== */

// Check admin session and open dashboard or login modal
function checkAdminSession() {
    const token = localStorage.getItem('dostana_admin_token');
    if (token) {
        openAdminDashboard();
    } else {
        openAdminLogin();
    }
}

function openAdminLogin() {
    document.getElementById('adminLoginModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAdminLoginModal() {
    document.getElementById('adminLoginModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function openAdminDashboard() {
    document.getElementById('adminDashboardModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    renderAdminProducts();
    renderAdminGallery();
}

function closeAdminDashboardModal() {
    document.getElementById('adminDashboardModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Admin Login handler
async function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('dostana_admin_token', data.token);
            closeAdminLoginModal();
            openAdminDashboard();
            showToast('लॉगिन सफल!', 'आप प्रबंधन पैनल में लॉग इन हैं।');
        } else {
            showToast('लॉगिन विफल!', data.message || 'गलत क्रेडेंशियल्स', true);
        }
    } catch (error) {
        showToast('त्रुटि!', 'सर्वर से कनेक्ट करने में विफल', true);
    }
}

// Admin Logout
function handleAdminLogout() {
    localStorage.removeItem('dostana_admin_token');
    closeAdminDashboardModal();
    showToast('लॉगआउट सफल!', 'आप सफलतापूर्वक लॉगआउट हो गए हैं।');
}

// Switch dashboard tabs
function switchDashboardTab(tab) {
    const tabProducts = document.getElementById('btnTabManageProducts');
    const tabGallery = document.getElementById('btnTabManageGallery');
    const panelProducts = document.getElementById('panelManageProducts');
    const panelGallery = document.getElementById('panelManageGallery');
    
    if (tab === 'products') {
        tabProducts.classList.add('active');
        tabGallery.classList.remove('active');
        panelProducts.classList.add('active');
        panelGallery.style.display = 'none';
    } else {
        tabProducts.classList.remove('active');
        tabGallery.classList.add('active');
        panelProducts.classList.remove('active');
        panelGallery.style.display = 'block';
    }
}

// Render products in the admin dashboard table
function renderAdminProducts() {
    const tbody = document.getElementById('adminProductsTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    productsData.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 600;">${p.titleHi} (${p.titleEn})</td>
            <td>${p.category}</td>
            <td style="color: var(--accent-orange-dark); font-weight: 700;">${p.price}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-edit-prod" onclick="showProductForm('${p.id}')"><i class="fa-solid fa-edit"></i></button>
                    <button class="btn-delete-prod" onclick="deleteProduct('${p.id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Show Product Add/Edit Form
function showProductForm(productId = '') {
    const wrapper = document.getElementById('productFormWrapper');
    const title = document.getElementById('productFormTitle');
    const form = document.getElementById('productForm');
    
    form.reset();
    document.getElementById('editProductId').value = '';
    
    if (productId) {
        title.innerText = 'उत्पाद संपादित करें (Edit Product)';
        const p = productsData.find(prod => prod.id === productId);
        if (p) {
            document.getElementById('editProductId').value = p.id;
            document.getElementById('prodCategory').value = p.category;
            document.getElementById('prodBadge').value = p.badge || '';
            document.getElementById('prodTitleHi').value = p.titleHi;
            document.getElementById('prodTitleEn').value = p.titleEn;
            document.getElementById('prodDesc').value = p.desc;
            document.getElementById('prodPrice').value = p.price;
            document.getElementById('prodImage').value = p.image;
            
            // Populate specs
            document.getElementById('specCapacity').value = p.specs['Capacity'] || p.specs['लोड क्षमता (Load Capacity)'] || '';
            document.getElementById('specSheet').value = p.specs['Sheet'] || p.specs['शीट की मोटाई (Sheet Thickness)'] || '';
            document.getElementById('specChassis').value = p.specs['Chassis'] || p.specs['चेसिस फ्रेम (Chassis Frame)'] || '';
            document.getElementById('specTyres').value = p.specs['Tyre Size'] || p.specs['टायर विकल्प (Tyres)'] || '';
            
            // Check for extra specs
            const keys = Object.keys(p.specs);
            const standardKeys = ['Capacity', 'Sheet', 'Chassis', 'Tyre Size', 'लोड क्षमता (Load Capacity)', 'शीट की मोटाई (Sheet Thickness)', 'चेसिस फ्रेम (Chassis Frame)', 'टायर विकल्प (Tyres)'];
            const extraKey = keys.find(k => !standardKeys.includes(k));
            if (extraKey) {
                document.getElementById('specExtraName').value = extraKey;
                document.getElementById('specExtraValue').value = p.specs[extraKey];
            } else {
                document.getElementById('specExtraName').value = '';
                document.getElementById('specExtraValue').value = '';
            }
        }
    } else {
        title.innerText = 'नया उत्पाद जोड़ें (Add Product)';
    }
    
    wrapper.style.display = 'block';
    wrapper.scrollIntoView({ behavior: 'smooth' });
}

function hideProductForm() {
    document.getElementById('productFormWrapper').style.display = 'none';
}

// Handle Product Add/Edit Submit
async function handleProductFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('editProductId').value;
    const isEdit = !!id;
    
    const category = document.getElementById('prodCategory').value;
    const badge = document.getElementById('prodBadge').value;
    const titleHi = document.getElementById('prodTitleHi').value;
    const titleEn = document.getElementById('prodTitleEn').value;
    const desc = document.getElementById('prodDesc').value;
    const price = document.getElementById('prodPrice').value;
    const image = document.getElementById('prodImage').value;
    
    const specs = {};
    const cap = document.getElementById('specCapacity').value;
    const sheet = document.getElementById('specSheet').value;
    const chassis = document.getElementById('specChassis').value;
    const tyres = document.getElementById('specTyres').value;
    const extraName = document.getElementById('specExtraName').value;
    const extraVal = document.getElementById('specExtraValue').value;
    
    if (cap) specs['Capacity'] = cap;
    if (sheet) specs['Sheet'] = sheet;
    if (chassis) specs['Chassis'] = chassis;
    if (tyres) specs['Tyre Size'] = tyres;
    if (extraName && extraVal) specs[extraName] = extraVal;
    
    const productData = {
        id: isEdit ? id : `${category}-${Date.now()}`,
        category,
        titleHi,
        titleEn,
        desc,
        price,
        image,
        badge,
        specs
    };
    
    const url = isEdit ? `/api/products/${id}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';
    
    try {
        const res = await fetch(url, {
            method,
            headers: API_HEADERS(),
            body: JSON.stringify(productData)
        });
        const result = await res.json();
        if (res.ok) {
            showToast('सफलता!', isEdit ? 'उत्पाद सफलतापूर्वक अपडेट किया गया।' : 'नया उत्पाद जोड़ा गया।');
            hideProductForm();
            await loadProducts();
            renderAdminProducts();
        } else {
            showToast('त्रुटि!', result.error || 'उत्पाद सहेजने में विफल', true);
        }
    } catch (error) {
        showToast('त्रुटि!', 'सर्वर से कनेक्ट करने में विफल', true);
    }
}

// Delete Product
async function deleteProduct(productId) {
    if (!confirm('क्या आप वाकई इस उत्पाद को हटाना चाहते हैं?')) return;
    
    try {
        const res = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: API_HEADERS()
        });
        if (res.ok) {
            showToast('सफलता!', 'उत्पाद हटा दिया गया है।');
            await loadProducts();
            renderAdminProducts();
        } else {
            showToast('त्रुटि!', 'उत्पाद हटाने में विफल', true);
        }
    } catch (error) {
        showToast('त्रुटि!', 'सर्वर से कनेक्ट करने में विफल', true);
    }
}

// Render gallery in admin dashboard
function renderAdminGallery() {
    const list = document.getElementById('adminGalleryList');
    if (!list) return;
    list.innerHTML = '';
    
    galleryData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'admin-gal-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="title-bar">${item.title}</div>
            <button class="delete-btn" onclick="deleteGalleryItem('${item.id}')" title="Delete Image"><i class="fa-solid fa-trash"></i></button>
        `;
        list.appendChild(div);
    });
}

// Handle file selection for gallery upload (base64)
function handleGalleryFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        document.getElementById('galFileData').value = event.target.result;
        document.getElementById('galFileName').value = file.name;
    };
    reader.readAsDataURL(file);
}

// Handle Gallery Add Submit
async function handleGalleryFormSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('galTitle').value;
    const fileData = document.getElementById('galFileData').value;
    const fileName = document.getElementById('galFileName').value;
    
    if (!fileData) {
        showToast('त्रुटि!', 'कृपया पहले कोई चित्र चुनें।', true);
        return;
    }
    
    try {
        // 1. Upload File
        const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            headers: API_HEADERS(),
            body: JSON.stringify({ fileName, fileData })
        });
        const uploadData = await uploadRes.json();
        
        if (!uploadRes.ok) {
            showToast('त्रुटि!', 'फाइल अपलोड विफल', true);
            return;
        }
        
        // 2. Add to Gallery JSON
        const galleryItem = {
            id: `g-${Date.now()}`,
            image: uploadData.filePath,
            title
        };
        
        const res = await fetch('/api/gallery', {
            method: 'POST',
            headers: API_HEADERS(),
            body: JSON.stringify(galleryItem)
        });
        
        if (res.ok) {
            showToast('सफलता!', 'गैलरी में चित्र जोड़ा गया।');
            document.getElementById('galleryForm').reset();
            document.getElementById('galFileData').value = '';
            document.getElementById('galFileName').value = '';
            await loadGallery();
            renderAdminGallery();
        } else {
            showToast('त्रुटि!', 'गैलरी प्रविष्टि जोड़ने में विफल', true);
        }
    } catch (error) {
        showToast('त्रुटि!', 'सर्वर से कनेक्ट करने में विफल', true);
    }
}

// Delete Gallery Item
async function deleteGalleryItem(itemId) {
    if (!confirm('क्या आप वाकई इस चित्र को हटाना चाहते हैं?')) return;
    
    try {
        const res = await fetch(`/api/gallery/${itemId}`, {
            method: 'DELETE',
            headers: API_HEADERS()
        });
        if (res.ok) {
            showToast('सफलता!', 'चित्र गैलरी से हटा दिया गया है।');
            await loadGallery();
            renderAdminGallery();
        } else {
            showToast('त्रुटि!', 'चित्र हटाने में विफल', true);
        }
    } catch (error) {
        showToast('त्रुटि!', 'सर्वर से कनेक्ट करने में विफल', true);
    }
}
