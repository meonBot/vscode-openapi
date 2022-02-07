import { useState } from "react";
import logo from "./icons/logo-light.svg";

export default function Header() {
  const [isOpen, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(!isOpen);
  };

  return (
    <div className="c_header">
      <div className="d-flex justify-content-between">
        <div>
          <span className="font-weight-bold">Powered by</span>
          <span>
            <a href="https://www.42crunch.com">
              <img src={logo} alt="" />
            </a>
          </span>
        </div>
        <div>
          <div className="dropdown">
            <button className="dropbtn" onClick={toggleOpen}>
              Learn More
            </button>
            <div className={isOpen ? "dropdown-content show" : "dropdown-content"}>
              <a href="https://42crunch.com/api-security-audit/">API Contract Security Audit</a>
              <a href="https://42crunch.com/api-conformance-scan/">API Contract Conformance Scan</a>
              <a href="https://42crunch.com/micro-api-firewall-protection/">API Protection</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
