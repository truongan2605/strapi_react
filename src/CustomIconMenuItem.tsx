import { ListItemIcon, Typography } from "@mui/material";
import { ReactElement } from "react";
import { MenuItemLink, MenuItemLinkProps } from "react-admin";

interface CustomIconMenuItemProps  extends MenuItemLinkProps {
    icon: ReactElement;
}

const CustomIconMenuItem  = ({ icon, primaryText, ...props }: CustomIconMenuItemProps) => {
    return (
        <MenuItemLink
            {...props}
            leftIcon={
                <ListItemIcon sx={{
                    justifyContent: 'center',
                    minWidth: 0,
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    {icon}
                    <Typography variant="caption"
                        sx={{
                            fontSize: '10px',
                            color: '#f0b400',
                            mt: '4px',
                            textTransform: 'uppercase',
                            fontWeight: 600
                        }}
                    >
                        {primaryText}
                    </Typography>
                </ListItemIcon>
            }
            sx={{
                justifyContent: 'center',
                '& .RaMenuItemLink-primaryText': {
                    display: 'none',
                },
                '& .MuiSvgIcon-root': {
                    fontSize: '28px',
                },
                height: '100px',
                width: '100px',
                marginLeft: '3px',
            }}
        />
    )

}

export default CustomIconMenuItem ;