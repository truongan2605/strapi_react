// CustomAppBar.tsx
import { AppBar, TitlePortal } from 'react-admin';
import { Box, styled } from '@mui/material';

const StyledAppBar = styled(AppBar)({
    '& .RaAppBar-menuButton': {
        display: 'none', 
    },
});

const CustomAppBar = (props: any) => {
    return (
        <StyledAppBar
            {...props}
            
            position="fixed"
            sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.85)', 
                backdropFilter: 'blur(8px)',
                // boxShadow: 'none',
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
        </StyledAppBar>
    );
};

export default CustomAppBar;
