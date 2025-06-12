import { Menu, MenuItemLink } from "react-admin";
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useLocation } from "react-router-dom";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';

const CustomMenu = () => {
    const location = useLocation();

return (
    <Menu>
        {/* Dashboard */}
        <MenuItemLink
            to="/"
            primaryText="DashBoard"
            leftIcon={<DashboardIcon />}

            selected={location.pathname === '/'}
        />

        {/* Resource: users */}
        <MenuItemLink
            to="/my-users"
            primaryText="Users"
            leftIcon={<GroupIcon />}
            selected={location.pathname.startsWith('/my-users')}


        />

        {/* Products */}
        <MenuItemLink
            to="/products"
            primaryText="Products"
            leftIcon={<ShoppingCartIcon />}
            selected={location.pathname.startsWith('/products')}

        />

        {/* Custom route */}
        <MenuItemLink
            to="/profile"
            primaryText="Profile"
            leftIcon={<PersonIcon />}
            selected={location.pathname.startsWith('/profile')}

        />

        <MenuItemLink
            to="/videos"
            primaryText="Videos"
            leftIcon={<OndemandVideoIcon />}
            selected={location.pathname.startsWith('/videos')}

        />
    </Menu>
    
);
};

export default CustomMenu;