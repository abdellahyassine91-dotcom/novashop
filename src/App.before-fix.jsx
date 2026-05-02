import { useState, useEffect } from "react";
import "./App.css";
import logo from "./assets/novashop.jpeg";

function App() {
  const ADMIN_PASSWORD = "admin123";

  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("novashop_products");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "ساعة ذكية",
            price: 219,
            category: "Electronics",
            image: "",
          },
          {
            id: 2,
            name: "حقيبة الظهر",
            price: 199,
            category: "الملابس",
            image: "",
          },
        ];
  });

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "العروض",
    image: "",
  });

  useEffect(() => {
    localStorage.setItem("novashop_products", JSON.stringify(products));
  }, [products]);

  function loginAdmin() {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setPassword("");
    } else {
      alert("كلمة السر خاطئة");
    }
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setNewProduct({ ...newProduct, image: reader.result });
    };
    reader.readAsDataURL(file);
  }
  const totalPrice = cart.reduce((total, item) => total + Number(item.price), 0);

  function addToCart(product) {
    setCart([...cart, product]);
  }

  function addProduct() {
    if (!newProduct.name || !newProduct.price) {
      alert("دخل الاسم والثمن");
      return;
    }
    function removeFrom(index){ setCart(cart.filter((_, i ) => i !== index ));
      }

    setProducts([
      ...products,
      {
        id: Date.now(),
        name: newProduct.name,
        price: Number(newProduct.price),
        category: newProduct.category,
        image: newProduct.image,
      },
    ]);

    setNewProduct({
      name: "",
      price: "",
      category: "العروض",
      image: "",
    });
  }

  function deleteProduct(id) {
    setProducts(products.filter((p) => p.id !== id));
  }

  // ✅ فلتر واحد فقط (optimized)
  const filteredProducts = products.filter(
    (p) =>
      (selectedCategory === "all" || p.category === selectedCategory) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );
  function removeFromCart(index) {
  setCart(cart.filter((_, i) => i !== index));
}
function sendOrderWhatsApp() {
  if (cart.length === 0) {
    alert("السلة فارغة");
    return;
  }

  const message =
    "سلام، بغيت نطلب هاد المنتجات:%0A%0A" +
    cart
      .map((item, index) => `${index + 1}- ${item.name} - ${item.price} درهم`)
      .join("%0A") +
    `%0A%0Aالمجموع: ${totalPrice} درهم`;

  window.open(`https://wa.me/212691834768?text=${message}`, "_blank");
}
const message =
  "سلام 👋\nبغيت نطلب:\n\n" +
  cart.map((item, i) => `${i+1}- ${item.name} (${item.price}dh)`).join("\n") +
  `\n\n💰 المجموع: ${totalPrice} درهم`;

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <img src={logo} alt="NovaShop" className="logo" />
        </div>

        <ul className="nav-center">
          <li>Home</li>
          <li>Shop</li>
          <li>Categories</li>
          <li>Contact</li>
        </ul>

        <div className="nav-right">
          <span className="cart">🛒 {cart.length}</span>
        </div>
      </nav>
      <div className="cart-box">
  <h3>🛒 السلة</h3>
  <button className="whatsapp-btn" onClick={sendOrderWhatsApp}>
  طلب عبر WhatsApp
</button>

  {cart.length === 0 ? (
    <p>السلة فارغة</p>
  ) : (
    <>
      {cart.map((item, index) => (
        <div key={index} className="cart-item">
          <span>{item.name}</span>
          <span>{item.price} dh</span>
          <button onClick={() => removeFromCart(index)}>❌</button>
        </div>
      ))}

      <h4>المجموع: {totalPrice} درهم</h4>
    </>
  )}
</div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>NovaShop 🔥</h1>
          <p>أفضل العروض في مكان واحد</p>
          <button>تسوق الآن</button>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories-section">
        <h2>تسوق حسب الفئة</h2>

        <div className="categories-grid">
          <div onClick={() => setSelectedCategory("all")}>🛍️ الكل</div>
          <div onClick={() => setSelectedCategory("العروض")}>🔥 العروض</div>
          <div onClick={() => setSelectedCategory("Electronics")}>📱 Electronics</div>
          <div onClick={() => setSelectedCategory("الملابس")}>👕 الملابس</div>
        </div>
      </section>

      {/* ADMIN */}
      {!isAdmin && (
        <section className="admin-login">
          <h3>🔐 Admin</h3>
          <input
            type="password"
            placeholder="كلمة السر"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={loginAdmin}>دخول</button>
        </section>
      )}

      {isAdmin && (
        <section className="admin-panel">
          <h2>⚙️ Admin Panel</h2>

          <input
            placeholder="اسم المنتج"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="الثمن"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />

          <select
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
          >
            <option>العروض</option>
            <option>Electronics</option>
            <option>الملابس</option>
          </select>

          <input type="file" onChange={handleImage} />

          <button onClick={addProduct}>➕ إضافة المنتج</button>

          <button onClick={() => setIsAdmin(false)}>خروج</button>
        </section>
      )}

      {/* PRODUCTS */}
      <main className="products-section">
        <h2>المنتجات 🛍️</h2>

        <input
          className="search-input"
          type="text"
          placeholder="بحث عن منتج..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="products">
          {filteredProducts.length === 0 ? (
            <p>ما كاين حتى منتج</p>
          ) : (
            filteredProducts.map((p, index) => (
              <div className="card" key={index}>
                {p.image ? (
                  <img src={p.image} alt={p.name} />
                ) : (
                  <div>📦</div>
                )}

                <h3>{p.name}</h3>
                <p>{p.price} درهم</p>

                {/* ✅ FIX */}
                <button onClick={() => addToCart(p)}>
                  Ajouter au panier
                </button>

                {isAdmin && (
                  <button onClick={() => deleteProduct(p.id)}>
                    حذف
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      <footer>NovaShop © 2026</footer>
    </div>
  );
}

export default App;