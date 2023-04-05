import "./NavBar.scss";
import pichuIcon from "./../assets/pichu-icon2.png";

function NavBar() {
  return (
    <div className="main-navbar">
      <img className="pichu-icon" src={pichuIcon} alt=""></img>
      <span className="navbar-title">
        <i>pichu</i>
      </span>
    </div>
  );
}

export default NavBar;
