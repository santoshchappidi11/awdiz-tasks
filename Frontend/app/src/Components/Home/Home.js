import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import api from "../ApiConfig/index";
// import { toast } from "react-hot-toast";

const Home = () => {
  const navigateTo = useNavigate();
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [filterByDate, setFilterByDate] = useState({ filter: "1" });
  const [name, setName] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [isProdExists, setIsProdExists] = useState("Loading...");
  console.log(isProdExists);
  // console.log(filterByDate);
  // console.log(name);

  console.log(page);

  const handleFilterChangeValue = (e) => {
    setFilterByDate({ [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setName(e.target.value);
    if (e.target.value) {
      setIsSearch(true);
    } else {
      setIsSearch(false);
    }
  };

  const incrementPage = () => {
    setPage((prev) => prev + 1);
  };

  const decrementPage = () => {
    if (page == 1) {
      setPage(1);
    } else {
      setPage((prev) => prev - 1);
    }
  };

  const getSearchProducts = async (productId) => {
    try {
      const response = await api.post("/get-search-products", { productId });

      if (response.data.success) {
        setAllProducts(response.data.products);
        setIsSearch(false);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    const getYourProducts = async () => {
      try {
        const response = await api.post("/all-products", {
          page,
          name,
          filterByDate,
        });
        // console.log(response.data);
        if (response.data.success) {
          setAllProducts(response.data.products);
        } else {
          setIsProdExists(response.data.message);
          // toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    getYourProducts();
  }, [page, filterByDate, name]);

  return (
    <div id="home-screen">
      <div id="home">
        <h2>Home</h2>
        <p>All Products</p>
        <div id="filter-search">
          <div id="search-word">
            <div id="search">
              <input
                type="text"
                placeholder="Search Products"
                onChange={handleSearchChange}
              />
            </div>
            <div id="search-results" className={isSearch && "searchByName"}>
              {allProducts &&
                allProducts?.map((prod) => (
                  <>
                    {isSearch && (
                      <p
                        key={prod._id}
                        onClick={() => getSearchProducts(prod._id)}
                      >
                        {prod.name}
                      </p>
                    )}
                  </>
                ))}
            </div>
          </div>
          <div>
            <h3>Filter by time created:</h3>
            <select
              onChange={handleFilterChangeValue}
              name="filter"
              value={filterByDate.filter}
              defaultValue="1"
            >
              <option value="-1">Ascending</option>
              <option value="1">Descending</option>
            </select>
          </div>
        </div>
        <div id="products">
          {allProducts?.length ? (
            allProducts?.map((product) => (
              <div
                className="product"
                key={product._id}
                onClick={() => navigateTo(`/single-product/${product._id}`)}
              >
                <div className="image">
                  <img src={product.image} alt="product" />
                </div>
                <div className="details">
                  <h2>{product.name}</h2>
                  <h3>₹{product.price}</h3>
                  <p>{product.category}</p>
                </div>
              </div>
            ))
          ) : (
            <h2>{isProdExists}</h2>
          )}
        </div>
        <div className="page-button">
          <button onClick={decrementPage}>Previous Page</button>
          <button onClick={incrementPage}>Next Page</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
