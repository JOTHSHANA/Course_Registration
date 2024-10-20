import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import SpaceDashboardTwoToneIcon from '@mui/icons-material/SpaceDashboardTwoTone';
import requestApi from "../utils/axios";
import { jwtDecode } from 'jwt-decode';
import "./styles.css";
import { getDecryptedCookie } from "../utils/encrypt";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import DashboardSharpIcon from '@mui/icons-material/DashboardSharp';
import FileUploadSharpIcon from '@mui/icons-material/FileUploadSharp';
import ListIcon from '@mui/icons-material/List';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';

function getIconComponent(iconPath) {
  switch (iconPath) {
    case 'AppRegistrationIcon':
      return <AppRegistrationIcon style={{ color: '#f57d93', fontSize: '30px' }} className="custom-sidebar-icon" />;
    case 'DashboardSharpIcon':
      return <DashboardSharpIcon style={{ color: '#05ce78', fontSize: '30px' }} className="custom-sidebar-icon" />;
    case 'FileUploadSharpIcon':
      return <FileUploadSharpIcon style={{ color: 'orange', fontSize: '30px' }} className="custom-sidebar-icon" />;
    case 'ListIcon':
      return <ListIcon style={{ color: '#219de2', fontSize: '30px' }} className="custom-sidebar-icon" />;
    case 'ChecklistRtlIcon':
      return <ChecklistRtlIcon style={{ color: '#05ce78', fontSize: '30px' }} className="custom-sidebar-icon" />;
    default:
      return null;
  }
}

function SideBar({ open, resource, onSidebarItemSelect, handleSideBar }) {
  const [activeItem, setActiveItem] = useState("");
  const [sidebarItems, setSidebarItems] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const basePath = import.meta.env.VITE_BASE_PATH;

  useEffect(() => {
    const fetchSidebarItems = async () => {
      try {
        const encryptedAuthToken = getDecryptedCookie("authToken");
        if (!encryptedAuthToken) {
          throw new Error("Auth token not found");
        }

        const decodedToken = jwtDecode(encryptedAuthToken);
        const { role } = decodedToken;
        // console.log(role)

        const response = await requestApi("GET", `/resources?role=${role}`);

        if (response.success) {
          setSidebarItems(response.data);
        } else {
          console.error("Error fetching sidebar items:", response.error);
        }
      } catch (error) {
        console.error("Error fetching sidebar items:", error);
      }
    };

    fetchSidebarItems();
  }, [resource, navigate]);

  useEffect(() => {
    const pathname = location.pathname;
    const activeItem = sidebarItems.find((item) => `${basePath}` + item.path === pathname);
    if (activeItem) {
      setActiveItem(activeItem.name);
      if (onSidebarItemSelect) {
        onSidebarItemSelect(activeItem.name);
      }
    }
  }, [location, sidebarItems, onSidebarItemSelect]);

  return (
    <div
      className={open ? "app-sidebar sidebar-open" : "app-sidebar"}
      style={{
        backgroundColor: "#2a3645",
      }}
    >
      <p style={{ color: 'white' }} className="a-name">Course Registration</p>
      <ul className="list-div">
        {sidebarItems.map((item) => (
          <li
            key={item.path}
            className={`list-items ${activeItem === item.name ? "active" : ""}`}
            onClick={() => {
              setActiveItem(item.name);
              onSidebarItemSelect(item.name);
              handleSideBar();
            }}
          >
            <Link className="link" to={`${basePath}` + item.path}>
              {getIconComponent(item.icon)}
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideBar;
