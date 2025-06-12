// CustomAppBar.tsx
import { AppBar, TitlePortal } from 'react-admin';
import { Box } from '@mui/material';


const CustomAppBar = (props: any) => {
    return (
        <AppBar
            {...props}
            // enableColorOnDark
            // position="static"
            position="fixed"
            sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.85)', 
                backdropFilter: 'blur(8px)',
                boxShadow: 'none',
                color: '#333 ',
                paddingX: 2,
                height: '64px',
                justifyContent: 'center',
            }}
        >
            <TitlePortal />
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                <Box display="flex" alignItems="center">
                    <img src="/logoEVG.png" alt="EVG" style={{ height: 40, marginRight: 12 }} />
                    
                </Box>

                
            </Box>
        </AppBar>
    );
};

export default CustomAppBar;
