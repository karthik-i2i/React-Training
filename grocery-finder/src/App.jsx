import { useState } from 'react'
import './App.css'

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

function ProductRow({ product }) {
  return (
    <div className='product-row'>
      <span style={{ color: !product.stocked ? 'red' : 'white', paddingLeft: '32px' }}>
        {product.name}
      </span>
      <span style={{paddingRight: '48px'}}>{product.price}</span>
    </div>
  );
}
function ProductCategoryRow({categorisedProducts}) {
  if (categorisedProducts.length === 0) return null;
  return (
    <>
      <div style={{padding: '10px 0 10px 0'}}>{categorisedProducts[0]?.category}</div>
      {categorisedProducts.map((product) => (
        <ProductRow product={product} key={product.name} />
      ))}
    </>
  );
}

function ProductTable({searchInput, products, showInStockProducts}) {
  const fruitProducts = products.filter(product => product.category === "Fruits" && 
    (!showInStockProducts || product.stocked) && 
    product.name.toLowerCase().includes(searchInput.toLowerCase())
  );
  const vegetableProducts = products.filter(product => product.category === "Vegetables" && 
    (!showInStockProducts || product.stocked) && 
    product.name.toLowerCase().includes(searchInput.toLowerCase())
  );
  return (
    <>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div className='product-table-heading'>Name</div>
        <div className='product-table-heading'>Price</div>
      </div>
      <ProductCategoryRow categorisedProducts={fruitProducts} />
      <ProductCategoryRow categorisedProducts={vegetableProducts} />
    </>

  );
}

function SearchBar({searchInput, showInStockProducts}) {
  return (
    <div className='search-bar'>
      <input type="text" placeholder="Search..." onChange={searchInput} />
      <div>
        <input type="checkbox" onClick={showInStockProducts}/> Only show products in stock
      </div>
    </div>
  )
}

function FilterableProductTable({products}) {
  const [showInStockProducts, setShowInStockProducts] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  function handleSearchInput(e) {
    setSearchInput(e.target.value);
  }
  return (
    <div>
      <SearchBar searchInput={handleSearchInput} showInStockProducts={() => setShowInStockProducts(prev => !prev)}/>
      <ProductTable searchInput={searchInput} products={products} showInStockProducts={showInStockProducts}/>
    </div>
  );
}

export default function App() {
  return (
      <FilterableProductTable products={PRODUCTS} />
  );
}

