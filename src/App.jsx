import { use, useEffect, useMemo, useState } from "react";
import "./App.css";
import logo from "./assets/novashop.jpeg";

const ADMIN_EMAIL = "abdellah.yassine91@gmail.com";
const ADMIN_PASSWORD = "Sanae1991@1201";
const WHATSAPP_NUMBER = "212691834768";

const DEFAULT_PRODUCTS = [
  { id: 1, name: "ساعة ذكية", price: 219, category: "Electronics", image: "" },
  { id: 2, name: "حقيبة الظهر", price: 199, category: "الملابس", image: "" },
];

function App() { 
  const API_URL = "http://localhost:5001";
  useEffect(() => {
  fetch(`${API_URL}/products`)
    .then((res) => res.json())
    .then((data) => setProducts(data))
    .catch((err) => console.log(err));
}, []);
  useEffect(() => {
  const saved = localStorage.getItem("isAdmin");
  if (saved === "true") {
    setIsAdmin(true);
    setPage("admin");
  }
}, []);
  const [page, setPage] = useState("home");
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem("novashop_admin") === "true");
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

  const [products, setProducts] = useState([]);
   useEffect(() => {
  fetch(`${API_URL}/products`)
    .then((res) => res.json())
    .then((data) => setProducts(data))
    .catch((err) => console.log(err));
}, []);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("novashop_cart");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
  localStorage.setItem("novashop_cart", JSON.stringify(cart));
}, [cart]);


  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("novashop_orders");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
  localStorage.setItem("novashop_orders", JSON.stringify(orders));
}, [orders]);
 
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "العروض",
    image: "",
  });


  useEffect(() => {
    localStorage.setItem("novashop_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("novashop_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("novashop_admin", isAdmin ? "true" : "false");
  }, [isAdmin]);

  const totalPrice = useMemo(
    () => cart.reduce((total, item) => total + Number(item.price), 0),
    [cart]
  );

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalProductsValue = useMemo(
    () => products.reduce((total, product) => total + Number(product.price), 0),
    [products]
  );

  const ordersTotal = useMemo(
    () => orders.reduce((total, order) => total + Number(order.total), 0),
    [orders]
  );

 
  function loginAdmin() {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    setIsAdmin(true);
    setEmail("");
    setPassword("");
    setPage("admin");
    return;
  }

  alert("Email ولا كلمة السر خاطئة");
}

  function logoutAdmin() {
    setIsAdmin(false);
    setPage("home");
  }

  function handleImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setNewProduct((current) => ({ ...current, image: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  function resetProductForm() {
    setNewProduct({ name: "", price: "", category: "العروض", image: "" });
    setEditingId(null);
  }

  function saveProduct() {
  if (!newProduct.name.trim() || !newProduct.price) {
    alert("دخل الاسم والثمن");
    return;
  }

  fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProduct),
  })
    .then((res) => res.json())
    .then((data) => {
      setProducts((prev) => [...prev, data]);
      resetProductForm();
    });

    const productData = {
      id: editingId || Date.now(),
      name: newProduct.name.trim(),
      price: Number(newProduct.price),
      category: newProduct.category,
      image: newProduct.image,
    };

    if (editingId) {
      setProducts((current) => current.map((product) => (product.id === editingId ? productData : product)));
    } else {
      setProducts((current) => [...current, productData]);
    }

    resetProductForm();
  }

  function startEditProduct(product) {
    setEditingId(product.id);
    setNewProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image || "",
    });
    setPage("admin");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

   function deleteProduct(id) {
  if (!confirm("واش متأكد بغيتي تحذف هاد المنتج؟")) return;

  fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  }).then(() => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((p) => p.id !== id));
  });
}

  function addToCart(product) {
    setCart((current) => [...current, product]);
  }

  function removeFromCart(indexToRemove) {
    setCart((current) => current.filter((_, index) => index !== indexToRemove));
  }

  function clearCart() {
    setCart([]);
  }

  function saveOrder() {
    const order = {
      id: Date.now(),
      date: new Date().toLocaleString("fr-FR"),
      items: cart,
      total: totalPrice,
      status: "جديد",
    };
    setOrders((current) => [order, ...current]);
    return order;
  }

  function updateOrderStatus(id, status) {
    setOrders((current) => current.map((order) => (order.id === id ? { ...order, status } : order)));
  }

  function deleteOrder(id) {
    setOrders((current) => current.filter((order) => order.id !== id));
  }

  function sendOrderWhatsApp() {
    if (cart.length === 0) {
      alert("السلة فارغة");
      return;
    }

    const order = saveOrder();
    const text =
      `سلام، بغيت نطلب هاد المنتجات. رقم الطلب: ${order.id}\n\n` +
      cart.map((item, index) => `${index + 1}- ${item.name} - ${item.price} درهم`).join("\n") +
      `\n\nالمجموع: ${totalPrice} درهم`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
    setCart([]);
  }

  function renderAdminLogin() {
    return (
      <section className="admin-login admin-page">
        <h2>🔐 دخول Admin</h2>
        <p>دخل كلمة السر باش تسير المنتجات والطلبات.</p>
        <input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(event) => setEmail(event.target.value)}
/>
        <input
          type="password"
          placeholder="كلمة السر"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && loginAdmin()}
        />
        <button onClick={loginAdmin}>دخول</button>
        <small>كلمة السر التجريبية: admin123</small>
      </section>
    );
  }

  function renderAdminDashboard() {
    return (
      <section className="admin-dashboard admin-page">
        <div className="admin-header">
          <div>
            <h2>⚙️ Admin Dashboard</h2>
        
            <p>هنا كتزيد المنتجات، كتعدلها، وكتراقب الطلبات.</p>
          </div>
          <button className="logout" onClick={logoutAdmin}>خروج</button>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><span>📦 المنتجات</span><strong>{products.length}</strong></div>
          <div className="stat-card"><span>🛒 السلة</span><strong>{cart.length}</strong></div>
          <div className="stat-card"><span>📑 الطلبات</span><strong>{orders.length}</strong></div>
          <div className="stat-card"><span>💰 مجموع الطلبات</span><strong>{ordersTotal} dh</strong></div>
        </div>

        <div className="admin-layout">
          <div className="admin-card">
            <h3>{editingId ? "✏️ تعديل المنتج" : "➕ إضافة منتج"}</h3>
            <div className="form admin-form">
              <input
                placeholder="اسم المنتج"
                value={newProduct.name}
                onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })}
              />
              <input
                type="number"
                placeholder="الثمن"
                value={newProduct.price}
                onChange={(event) => setNewProduct({ ...newProduct, price: event.target.value })}
              />
              <select
                value={newProduct.category}
                onChange={(event) => setNewProduct({ ...newProduct, category: event.target.value })}
              >
                <option>العروض</option>
                <option>Electronics</option>
                <option>الملابس</option>
                <option>Beauty</option>
                <option>Home</option>
              </select>
              <input type="file" accept="image/*" onChange={handleImage} />
              {newProduct.image && <img className="preview-img" src={newProduct.image} alt="preview" />}
              <button onClick={saveProduct}>{editingId ? "حفظ التعديل" : "إضافة المنتج"}</button>
              {editingId && <button className="cancel-btn" onClick={resetProductForm}>إلغاء التعديل</button>}
            </div>
          </div>

          <div className="admin-card">
            <h3>📋 لائحة المنتجات</h3>
            <div className="admin-table">
              {products.map((product) => (
                <div className="admin-row" key={product.id}>
                  <span>{product.name}</span>
                  <span>{product.price} dh</span>
                  <button onClick={() => startEditProduct(product)}>تعديل</button>
                  <button className="danger" onClick={() => deleteProduct(product.id)}>حذف</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-card orders-card">
          <h3>📦 الطلبات</h3>
          {orders.length === 0 ? (
            <p>ما كاين حتى طلب دابا.</p>
          ) : (
            orders.map((order) => (
              <div className="order-row" key={order.id}>
                <div>
                  <strong>طلب #{order.id}</strong>
                  <p>{order.date}</p>
                  <p>{order.items.map((item) => item.name).join("، ")}</p>
                  <b>{order.total} dh</b>
                </div>
                <select value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value)}>
                  <option>جديد</option>
                  <option>قيد المعالجة</option>
                  <option>تم الإرسال</option>
                  <option>ملغي</option>
                </select>
                <button className="danger" onClick={() => deleteOrder(order.id)}>حذف</button>
              </div>
            ))
          )}
        </div>
      </section>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-left">
          <img src={logo} alt="NovaShop" className="logo" />

        </div>
        <ul className="nav-center">
          <li onClick={() => setPage("home")}>Home</li>
          <li onClick={() => window.scrollTo({ top: 650, behavior: "smooth" })}>Shop</li>
          <li onClick={() => window.scrollTo({ top: 950, behavior: "smooth" })}>Categories</li>
          <li onClick={() => alert("WhatsApp: +" + WHATSAPP_NUMBER)}>Contact</li>
          <li onClick={() => setPage("admin")}>Admin</li>
        </ul>
        <div className="nav-right">
          <span className="cart">🛒 {cart.length}</span>
        </div>
      </nav>
<a
  href="https://wa.me/212691834768"
  target="_blank"
  rel="noopener noreferrer"
  className="whatsapp-float"
>
  💬
</a>

      {page === "admin" ? (
        isAdmin ? renderAdminDashboard() : renderAdminLogin()
      ) : (
        <>
          <section className="hero">
            <div className="hero-content">
              <h1>NovaShop 🔥</h1>
              <p>أفضل العروض في مكان واحد</p>
              <button onClick={() => window.scrollTo({ top: 650, behavior: "smooth" })}>تسوق الآن</button>
            </div>
          </section>

          <section className="cart-box">
            <h3>🛒 السلة</h3>
            {cart.length === 0 ? (
              <p>السلة فارغة</p>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="cart-item">
                    <span>{item.name}</span>
                    <span>{item.price} dh</span>
                    <button onClick={() => removeFromCart(index)}>❌</button>
                  </div>
                ))}
                <h4>المجموع: {totalPrice} درهم</h4>
                <button className="whatsapp-btn" onClick={sendOrderWhatsApp}>طلب عبر WhatsApp</button>
                <button className="clear-btn" onClick={clearCart}>إفراغ السلة</button>
              </>
            )}
          </section>

          <section className="categories-section">
            <h2>تسوق حسب الفئة</h2>
            <div className="categories-grid">
              <button onClick={() => setSelectedCategory("all")}>🛍️ الكل</button>
              <button onClick={() => setSelectedCategory("العروض")}>🔥 العروض</button>
              <button onClick={() => setSelectedCategory("Electronics")}>📱 Electronics</button>
              <button onClick={() => setSelectedCategory("الملابس")}>👕 الملابس</button>
              <button onClick={() => setSelectedCategory("Beauty")}>💄 Beauty</button>
              <button onClick={() => setSelectedCategory("Home")}>🏠 Home</button>
            </div>
          </section>

          <main className="products-section">
            <h2>المنتجات 🛍️</h2>
            <input
              className="search-input"
              type="text"
              placeholder="بحث عن منتج..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="products">
              {filteredProducts.length === 0 ? (
                <p>ما كاين حتى منتج</p>
              ) : (
                filteredProducts.map((product) => (
                  <div className="card" key={product.id}>
                    {product.image ? <img src={product.image} alt={product.name} /> : <div className="no-image">📦</div>}
                    <div className="card-content">
                      <span className="category">{product.category}</span>
                      <h3>{product.name}</h3>
                      <p className="price">{product.price} درهم</p>
                      <button className="btn" onClick={() => addToCart(product)}>إضافة للسلة</button>
                      {isAdmin && (
                        <>
                          <button className="edit-btn" onClick={() => startEditProduct(product)}>تعديل</button>
                          <button className="delete" onClick={() => deleteProduct(product.id)}>حذف المنتج</button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </>
      )}

      <footer>NovaShop © 2026</footer>
    </div>
  );
}

export default App;
