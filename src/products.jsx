 import watch from "./assets/watch.jpeg";
import pack from "./assets/pack.jpeg";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtjn3KSU8PxOHCy3Ed6RoFtE1fpiNb4aw",
  authDomain: "novashop-e5643.firebaseapp.com",
  projectId: "novashop-e5643",
  storageBucket: "novashop-e5643.firebasestorage.app",
  messagingSenderId: "208735453501",
  appId: "1:208735453501:web:03934d35d4acb732e30554",
  measurementId: "G-4TK688KVR3"
};
function Products() {
  const products = [
    {
      name: "ساعة ذكية",
      price: 219,
      image: watch,
    },
    {
      name: "حقيبة الظهر",
      price: 199,
      image: pack,
    },
  ];

  return (
    <div className="products">
      {products.map((p, i) => (
        <div className="card" key={i}>
          <img src={p.image} alt={p.name} />

          <div className="card-content">
            <h3>{p.name}</h3>
            <p className="price">{p.price} درهم</p>
            <button className="btn">إضافة للسلة</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Products;