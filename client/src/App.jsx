import Dashboard from './components/Dashboard';
import Header from './components/Header';
import LoginRegister from './components/LoginRegister';
import './App.css';
// import Auth from './auth/Auth';
import { verifyUser } from './auth/VerifyUser';
import { likeImage } from './api/Likes';
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { fetchImages } from './api/Images';
import { fetchCategories } from './api/Categories';
// import SearchBar from './components/SearchBar';
// import { query } from 'express';
// import jsonFetch from './jsonFetch';

const SearchPage = () => {
  const { query } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState(null);
  const [category, setCategory] = useState("All");
  const [categories, loadCategories] = useState();
  const [page, setPage] = useState(0); //1
  const [imagebase, loadBase] = useState([]);
  const [imageset, chooseImages] = useState([]);
  const [msg, setMsg] = useState("");
  const [user_id, setId] = useState(0);
  const page_size = 12;

  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    // console.log(category);
    navigate(`/search/${category}`);
    setCategory(category);
    setPage(1);
    let newImages;
    if (category == "All") {
      newImages = imagebase;
    } else {
      newImages = imagebase.filter((item) => (item.image_category === categories[category]));
    }
    chooseImages(newImages);
    setSorting(null);
    console.log("Set:", imageset.length, newImages.length);    
  };

  useEffect(()=>{
    getCategories();
  },[])

  const getCategories = async () => {
    try {
      setLoading(true);
      const result = await fetchCategories();
      loadCategories(result)
      // console.log("loadCategories:", Object.keys(result).length);
    } catch (error) {
      setError('Could not fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    imageBase();
  },[])

  const imageBase = async () => {
    try {
      setLoading(true);
      const result = await fetchImages();
      loadBase(result);
      chooseImages(result);
      console.log("loadBase:", result.length);
      setPage(1);
    } catch (error) {
      setError('Could not fetch images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getImages = () => {
      checkUser();
      setImages(imageset.slice((page-1)*page_size, page*page_size));
      // console.log(imageset);
      };
    getImages();
  }, [page, imageset, sorting]);

    const handleNext = () => {
      setPage(page + 1);
    };

    const handlePrev = () => {
      setPage(page - 1);
    };

    const sortDateDown = () => {
      chooseImages(imageset.sort((item1, item2) => item1.date_created < item2.date_created ? 1 : -1));
      setSorting("DateDown");
      setPage(1);
    };

    const sortDateUp = () => {
      chooseImages(imageset.sort((item1, item2) => item1.date_created > item2.date_created ? 1 : -1));
      setSorting("DateUp");
      setPage(1);
    };

    const sortRatingDown = () => {
      chooseImages(imageset.sort((item1, item2) => item1.users_likes.length < item2.users_likes.length ? 1 : -1));
      setSorting("RatingDown");
      setPage(1);
    };

    const sortRatingUp = () => {
      chooseImages(imageset.sort((item1, item2) => item1.users_likes.length > item2.users_likes.length ? 1 : -1));
      setSorting("RatingUp");
      setPage(1);
    };

    const checkUser = async () => {
      try {
        setLoading(true);
        const result = await verifyUser();
        // console.log("Verify user:", result);
        setId(result);
      } catch (error) {
        setError('Could not verify user');
        setId(0);
      } finally {
        setLoading(false);
      }
    };

    const like = async (item_id) => { // async
      if (user_id > 0) {
        const current_item = imagebase.filter((item) => (item.id === item_id));
        // console.log("current_item:", current_item);
        // let index = imagebase.indexOf(current_item[0]);
        console.log("item_id:",item_id);
        const likes_list = current_item[0].users_likes;
        // console.log("likes_list:", likes_list);
        if (likes_list.includes(user_id)) {          	
          // let index = likes_list.indexOf(user_id);
          likes_list.splice(likes_list.indexOf(user_id), 1);
          // console.log("likes_list2:", likes_list);
        } else {
          likes_list.push(user_id);
          // console.log("likes_list2:", likes_list);
        }
        try {
          setLoading(true);
          const result = await likeImage(user_id, item_id, likes_list);
          // console.log("like1:", result);
          if (result === true) {
            // console.log("AAA:", index, imagebase[index].users_likes, imageset[index].users_likes, images[index].users_likes,);
          }
        } catch (error) {
          setError('Could not verify user');
        } finally {
          setLoading(false);
        }
      } else console.log("Not authenticated");
    };

  return (
    <div>
      <div className="category-buttons">
        <button className='cats' key="All" onClick={() => handleCategoryClick("All")}>All</button>
        {categories &&
          Object.keys(categories).filter(category => category != "Inactive").map((category) => {
            return <button className='cats' key={category} onClick={() => handleCategoryClick(category)}>
              {category}
            </button>
          })}
        <h3>{msg}</h3>
      </div>

      {/* <Test /> */}
      {/* <h2>{query} Pictures</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && <ImageGrid images={images} />} */}

      <h2>{category} Pictures: {imageset.length}</h2>
      <p className='sorting'>Sort by:&emsp;
      <span className='sort_options' onClick={sortRatingUp}>Rating &uArr;&nbsp;&nbsp;</span>
      <span className='sort_options' onClick={sortRatingDown}>Rating &dArr;&emsp;</span>
      <span className='sort_options' onClick={sortDateUp}>Date &uArr;&nbsp;&nbsp;</span>
      <span className='sort_options' onClick={sortDateDown}>Date &dArr;&nbsp;</span>
      </p>
      {page > 1 ? <span className='navs' onClick={handlePrev}>&lArr;PREV&ensp;</span> :
        <span style={{ visibility: 'hidden' }}>&lArr;PREV&ensp;</span>}
      {images.length === page_size ? <span className='navs' onClick={handleNext}>&ensp;NEXT&rArr;</span> :
        <span style={{ visibility: 'hidden' }}>&ensp;NEXT&rArr;</span>}
      <div className="image-grid">
        {images.map((item) => (
          <div key={item.id} className="image-card">
            <p className="title">{item.title}</p>
            <a href={"#foto"+item.id} title={item.description}>
              <img src={item.image_link} alt={item.title}/>
            </a>
            <a id={"foto"+item.id} href="#" className="full" style={{ backgroundImage: `url(${item.image_link})` }}></a>
            <p className="attributes">
              <span className="date_created">{item.date_created.slice(0, 10)}&emsp;&emsp;</span>              
                {item.users_likes.includes(user_id) ? <span className="star" onClick={() => like(item.id)}>&#9733;</span> : 
                <span className="star" onClick={() => like(item.id)}>&#9734;</span>}                
              <span>&nbsp;{item.users_likes.length}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {

  return (
    <>
      <Header/>
      <Routes>
        <Route path='/dashboard' element={<Dashboard/>} />
        {/* <Route path='/test' element={<Test />} /> */}
        <Route path='/login' element={<LoginRegister mode="Login" />} />
        <Route path='/register' element={<LoginRegister mode="Register" />} />        
        <Route path="/" element={<SearchPage />} />
        <Route path="/search/:query" element={<SearchPage />} />
      </Routes>
    </>
  )
}

export default App;
