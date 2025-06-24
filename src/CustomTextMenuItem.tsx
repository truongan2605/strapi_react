import { ReactElement } from "react";
import { MenuItemLink, MenuItemLinkProps } from "react-admin";

interface CustomTextMenuItemProps extends MenuItemLinkProps {
    icon: ReactElement;
}

const CustomTextMenuItem = ({ icon, ...props }: CustomTextMenuItemProps) => {
    return (
        <MenuItemLink
            {...props}
            leftIcon={icon}
            sx={{
                height: '60px',
                fontSize: '16px',
                padding:'5px',
                margin:'1px',
                '&.RaMenuItemLink-active': {
                    fontWeight: 'bold',
                },
                
            }}
        />
    )
}

export default CustomTextMenuItem;