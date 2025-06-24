// theme.ts
import { defaultLightTheme } from 'react-admin';
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    ...defaultLightTheme,
    palette: {
        ...defaultLightTheme.palette,
        mode: 'light',
        background: {
            default: '#FFFFFF',
        },
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
        text: {
            primary: '#000000',
            secondary: '#333333',
        },
    },
    components: {
        ...defaultLightTheme.components,
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#f5f5f5',
                },
            },
        },
        RaSidebar: {
            styleOverrides: {
                root: {
                    width: '120px',
                    minWidth: '120px',
                    maxWidth: '120px',
                    padding: 0,
                    boxSizing: 'border-box',
                },
            },
        },
        RaMenu: {
            styleOverrides: {
                root: {
                    width: '110px !important',
                    maxWidth: '110px !important',
                    minWidth: '110px !important',
                },
            },
        },


    },
});
