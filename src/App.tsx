import Layout from "Layout";
import HomePage from "pages/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "./main.scss";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout></Layout>}>
            <Route index element={<HomePage></HomePage>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
