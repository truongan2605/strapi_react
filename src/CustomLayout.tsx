import { Layout, LayoutProps } from "react-admin";
import CustomMenu from "./Menu";
import CustomAppBar from "./CustomAppBar";

const CustomLayout = (props: LayoutProps) => (
    <Layout {...props} menu={CustomMenu} appBar={CustomAppBar} sx={{
        '& .RaLayout-content': {
            paddingTop: '10px', 
        },
    }} />
);



export default CustomLayout;