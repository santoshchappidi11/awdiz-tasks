import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import api from "../ApiConfig/index";
import { toast } from "react-hot-toast";

const Home = () => {
  const navigateTo = useNavigate();
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [filterByDate, setFilterByDate] = useState({ filter: "1" });
  const [name, setName] = useState("");
  // console.log(filterByDate);
  // console.log(name);

  // console.log(page);

  const handleFilterChangeValue = (e) => {
    setFilterByDate({ [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setName(e.target.value);
  };

  const incrementPage = () => {
    setPage((prev) => prev + 1);
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
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    getYourProducts();
  }, [page, filterByDate, name]);

  return (
    <div id="home-screen">
      <div id="home">
        <h2>Home</h2>
        <p>All Products</p>
        <div>
          <input
            style={{
              height: "30px",
              width: "200px",
              border: "1px solid black",
            }}
            type="text"
            onChange={handleSearchChange}
          />
        </div>
        {/* <div
          id="search-results"
          style={{ height: "800px", width: "200px", border: "1px solid black" }}
        ></div> */}
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
            <h2>No Products Found!</h2>
          )}
        </div>
        <div>
          <button onClick={incrementPage}>Next Page</button>
        </div>
        <div
          style={{
            padding: "20px 40px",
          }}
        >
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
    </div>
  );
};

export default Home;
