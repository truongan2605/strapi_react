// src/components/MenuHeader.tsx
import { Box, Typography, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface MenuHeaderProps {
    isCollapsed: boolean,
    onToggle: () => void;
}

const MenuHeader = ({ isCollapsed, onToggle }: MenuHeaderProps) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                backgroundColor: '#fff8e1', // màu vàng nhạt
                borderBottom: '1px solid #f0b400',
                height: '48px',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HomeIcon sx={{ color: '#f0b400' }} />
                
                    <Typography sx={{ color: '#b68600', fontWeight: 600  }}>
                        Account Home
                    </Typography>
                

            </Box>

            <IconButton size="small" onClick={onToggle}>
                {isCollapsed ? <ArrowForwardIosIcon fontSize="small"/> : <ArrowBackIosNewIcon fontSize="small"/>}
            </IconButton>

        </Box>
    );
};

export default MenuHeader;
