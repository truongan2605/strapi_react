import { Menu } from "react-admin";
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useLocation } from "react-router-dom";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';

import { Box } from "@mui/material";
import CustomIconMenuItem from "./CustomIconMenuItem";
import CustomTextMenuItem from "./CustomTextMenuItem";
import MenuHeader from "./MenuHeader";
import { useState } from "react";

const CustomMenu = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <Box sx={{ display: "flex" }}>

            <Box
                sx={{
                    marginLeft: '3px',
                    marginTop: '24px',
                    border: '2px solid #f0b400',
                    borderRadius: '18px',
                    backgroundColor: 'white',
                    height: 'auto',
                    paddingTop: '20px',
                    paddingBottom: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '110px',
                    boxSizing: 'border-box',

                }}
            >

                <CustomIconMenuItem
                    to="https://www.youtube.com/"
                    primaryText="Streaming"
                    icon={<OndemandVideoIcon />}
                    target="_blank"
                    rel="noopener"
                />
                <CustomIconMenuItem
                    to="https://drive.google.com/"
                    primaryText="Storage"
                    icon={<ShoppingCartIcon />}
                    target="_blank"
                    rel="noopener"
                />
                <CustomIconMenuItem
                    to="https://cloud.google.com/"
                    primaryText="Cloud"
                    icon={<DashboardIcon />}
                    target="_blank"
                    rel="noopener"
                />
                <CustomIconMenuItem
                    to="https://www.youtube.com/"
                    primaryText="Streaming"
                    icon={<OndemandVideoIcon />}
                    target="_blank"
                    rel="noopener"
                />
                <CustomIconMenuItem
                    to="https://drive.google.com/"
                    primaryText="Storage"
                    icon={<ShoppingCartIcon />}
                    target="_blank"
                    rel="noopener"
                />
                <CustomIconMenuItem
                    to="https://cloud.google.com/"
                    primaryText="Cloud"
                    icon={<DashboardIcon />}
                    target="_blank"
                    rel="noopener"
                />


            </Box>


            <Box
                sx={{
                    marginLeft: '3px',
                    marginTop: '24px',
                    backgroundColor: 'white',
                    height: 'auto',
                    paddingTop: '20px',
                    paddingBottom: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    boxSizing: 'border-box',
                }}
            >
                <MenuHeader isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
                {!isCollapsed && (
                    <>
                        <CustomTextMenuItem

                            to="/"
                            primaryText="DashBoard"
                            icon={<DashboardIcon />}
                            selected={location.pathname === '/'}
                        />

                        {/* Resource: my-users */}
                        <CustomTextMenuItem
                            to="/my-users"
                            primaryText="Users"
                            icon={<GroupIcon />}
                            selected={location.pathname.startsWith('/my-users')}
                        />


                        {/* Products */}
                        <CustomTextMenuItem
                            to="/products"
                            primaryText="Products"
                            icon={<ShoppingCartIcon />}
                            selected={location.pathname.startsWith('/products')}

                        />

                        {/* Custom route */}
                        <CustomTextMenuItem
                            to="/profile"
                            primaryText="Profile"
                            icon={<PersonIcon />}
                            selected={location.pathname.startsWith('/profile')}

                        />

                        <CustomTextMenuItem
                            to="/videos"
                            primaryText="Videos"
                            icon={<OndemandVideoIcon />}
                            selected={location.pathname.startsWith('/videos')}

                        />
                    </>
                )}
            </Box>


            



        </Box>



    );
};

export default CustomMenu;